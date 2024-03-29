import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {getDatabase, ref, child, update, get} from 'firebase/database'
import Papa from 'papaparse'
import {Constituency, Property, User} from '../entities'
import {STATIONS, SCHOOLS, CONSTITUENCY_NAME} from '../CONFIG'
import {INIT_FILTER_OPTIONS} from './../../features/filterSlice'
import { firebaseConfig } from "../../localConst"

/**
 * A control class manage the flow of data between the application and database
 */
class DatabaseMgr {
  constructor () {
    /** @public */
    this.properties = null
    /** @public */
    this.constituencies = null
    /** @public */
    this.avgPropertiesCount = null
    this.totalNoOfFilteredProperties = null
    this.avgConstituencyValue = null
    
    this.initFirebase()
    
  }
  /**
   * @param  {String} authUserInfo
   * @param  {function} onFetchEnd
   */
  initActiveUser(authUserInfo, onFetchEnd) {
    const {name, email, emailVerified, isGoogleAuth} = authUserInfo
    const newUser = new User(name, email, isGoogleAuth)
    newUser.isVerified = emailVerified
    const dbRef = ref(getDatabase())
    get(child(dbRef, `account/${newUser.id}`)).then(snapshot => {
      if (snapshot.exists()) {
        const {recentSearches, bookmarks, name: dbName} = snapshot.val()
        newUser.name = name || dbName
        newUser.recentSearches = recentSearches || []
        newUser.bookmarks = bookmarks || []
      } else {
        console.log('no user data record')
      }
      onFetchEnd(newUser)
    })
    // onValue(ref(db, ), snapshot => {
    //   const {recentSearches, bookmarks, isVerified, registerViaGoogle} = snapshot.val()
    //   newUser.isVerified = isVerified
    //   newUser.registerViaGoogle = registerViaGoogle || false
    //   newUser.recentSearches = recentSearches || []
    //   newUser.bookmarks = bookmarks || []
    //   onFetchEnd(newUser)
    //   console.log('magic!')
    // })
  }

  /**
   * 
   * @param {String} id 
   * @param {function} onFetchEnd 
   */
  getUserDataDB(id, onFetchEnd) {
    const dbRef = ref(getDatabase())
    get(child(dbRef, `account/${id}`)).then(snapshot => {
      if (snapshot.exists()) {
        onFetchEnd(snapshot.val())
      } else {
        onFetchEnd(false)
        console.log('no user data record')
      }
    })
  }
  
  /**
   * 
   * @param {String} key 
   * @param {function} onFetchEnd
   */
  fetchDataDB(key, onFetchEnd) {
    const dbRef = ref(getDatabase())
     get(child(dbRef, key)).then(snapshot => {
      if (snapshot.exists()) {
        onFetchEnd(snapshot.val())
      } else {
        onFetchEnd(false)
        console.log('data not found', key)
      }
    })
  }

  /**
   * 
   * @param {String} key 
   * @param {Object} value 
   */
  updateDataDB(key, value) {
    const updates = {}
    const db = getDatabase()
    updates[key] = value
    update(ref(db), updates)
  }
  
  /**
   * initialise firebase connection
   */
  initFirebase () {
    // Initialize Firebase
    // const app = initializeApp(firebaseConfig)
    initializeApp(firebaseConfig)
    // getAnalytics(app)
  }
  
  /**
   * 
   * @param {User} user 
   * @param {String} key 
   * @param {any} value
   * @description update user data to firebase
   */
  updateUserDataDB(user, key, value) {
    if (!user) {
      console.log("no active user to update db")
      return
    }
    const updates = {}
    const db = getDatabase()
    updates[`account/${user.id}/${key}`] = value
    
    update(ref(db), updates)
  }

  /**
   * fetch all properties data from local csv
   * @param {function} callback 
   */
  fetchPropertyData (onFetchEnd) {
    if (this.properties && this.constituencies) {
      onFetchEnd(this.properties, this.constituencies)
      return
    }

    console.log('first fetch property data')

    fetch('data/data-all.csv')
      .then(res => res.text())
      .then(raw => Papa.parse(raw, {header: true}))
      .then(parsedRaw => {
        this.properties = []
        this.constituencies = {}
        parsedRaw.data
          .forEach(d => {
            d['lat'] = parseFloat(d['lat'])
            d['lng'] = parseFloat(d['lng'])
  
            const distToMrts = d['distToMrt'].split(',').map(distStr => parseFloat(distStr))
            d['mrts'] = d['mrtID'].split(',').map((mID, i) => {
              return {...STATIONS[mID], dist: distToMrts[i]}
            })
            d['avgMrtDist'] = Math.min(...distToMrts)
            

            const distToSchools = d['distToSchool'].split(',').map(distStr => parseFloat(distStr))
            d['schools'] = d['schoolID'].split(',').map((sID, i) => ({name: SCHOOLS[sID], dist: distToSchools[i]}) )
            d['avgSchoolDist'] = Math.min(...distToSchools)
            
            const p = new Property(d)
            this.properties.push(p)
            const constituencyID = parseInt(d['constituencyID'])
            let constituencyName = CONSTITUENCY_NAME[constituencyID].name
            
            if (!this.constituencies[constituencyName]) this.constituencies[constituencyName] = new Constituency(constituencyID, constituencyName)
            p.constituency = this.constituencies[constituencyName]
            this.constituencies[constituencyName].properties.push(p)

          })

          // some of the constituency may not have any properties in database
          Object.keys(CONSTITUENCY_NAME).forEach(dID => {
            const dName = CONSTITUENCY_NAME[dID].name
            if (!this.constituencies[dName]) {
              this.constituencies[dName] = new Constituency(dID, dName)
            }
          })
          
          this.updateFilterDependVars(INIT_FILTER_OPTIONS)
          
          onFetchEnd(this.properties, this.constituencies)
      })
  }

  /**
   * update variable values that depends on filter options
   * @param {Object} filterOptions 
   */
  updateFilterDependVars (filterOptions) {
    // needed by getConsituencyValue()
    this.properties.forEach(p => p.updatePropertyScore(filterOptions))
  
    // needed by avgConstituencyValue, must be called before avgConstituencyValue
    this.totalNoOfFilteredProperties = Object.keys(this.constituencies).reduce((acc, cName) => {
      return acc + this.constituencies[cName].getFilteredProperties(filterOptions).length
    }, 0)

    this.avgConstituencyValue = Object.keys(this.constituencies).reduce((valSum, cName) => valSum + this.constituencies[cName].getConstituencyValue(filterOptions), 0) / 31
    
    Object.keys(this.constituencies).forEach(cName => {
      this.constituencies[cName].updateConstituencyScore(filterOptions, this.avgConstituencyValue)
    })
    // this.avgConstituencyValue *= 1.4
    this.avgPropertiesCount = this.totalNoOfFilteredProperties / 31

    
  }

  /**
   * 
   * @returns {Property[]}
   */
  getProperties () {
    return this.properties
  }

  /**
   * 
   * @returns {Object}
   */
  getConstituencies () {
    return this.constituencies
  }

}

export default DatabaseMgr
