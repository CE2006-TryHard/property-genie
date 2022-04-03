import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {getDatabase, ref, child, update, get} from 'firebase/database'
import Papa from 'papaparse'
// import Constituency from '../entities/Constituency'
import {Constituency, Property, User} from '../entities/index'
import {STATIONS, SCHOOLS, CONSTITUENCY_NAME} from '../CONFIG'

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
   * @param  {String} name
   * @param  {String} email
   * @param  {function} onFetchEnd
   */
  initActiveUser(name, email, onFetchEnd) {
    const newUser = new User(name, email)
    const dbRef = ref(getDatabase())
    get(child(dbRef, `account/${newUser.id}`)).then(snapshot => {
      if (snapshot.exists()) {
        const {recentSearches, bookmarks, isVerified, registerViaGoogle} = snapshot.val()
        newUser.isVerified = isVerified
        newUser.registerViaGoogle = registerViaGoogle || false
        newUser.recentSearches = recentSearches || []
        newUser.bookmarks = bookmarks || []
      } else {
        console.log('no data available. Initialise user with name, email, and default value.')
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
   * @param {String} email 
   * @param {function} onFetchEnd 
   */
  getUserDataDB(email, onFetchEnd) {
    const id = email.split('.')[0]
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
    return get(child(dbRef, key)).then(snapshot => {
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
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyAvXrCz1aaHL0MH8a6qQFW9zfwS8FP_mks",
      authDomain: "tryhard-web-app.firebaseapp.com",
      projectId: "tryhard-web-app",
      databaseURL: "https://tryhard-web-app-default-rtdb.asia-southeast1.firebasedatabase.app/",
      storageBucket: "tryhard-web-app.appspot.com",
      messagingSenderId: "750566440817",
      appId: "1:750566440817:web:731d0e05cc3376a18700d0",
      measurementId: "G-S92ZF52QRN"
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    getAnalytics(app)
    // const analytics = getAnalytics(app)

    // test fetch data
    // this.fetchUserData(userData => {
    //   console.log('userData', userData)
    // })

    // test update data
    // this.updateUserDataDB('recent', 'house')
  }

  // fetchAllUserData(userId, onFetchEnd) {
  //   const db = getDatabase()
  //   onValue(ref(db, `account/${userId}`), snapshot => {
  //     onFetchEnd(snapshot.val())
  //   })
  // }

  /**
   * 
   * @param {User} user 
   * @param {String} key 
   * @param {any} value
   * @description update user data to firebase
   */
  updateUserDataDB(user, key, value) {
    if (!user) {
      console.log("no active user")
      return
    }
    const updates = {}
    const db = getDatabase()
    updates[`account/${user.id}/${key}`] = value
    
    update(ref(db), updates)
  }

  // fetchFilterData (onFetchEnd) {
  //   const db = getDatabase()
  //   onValue(ref(db, `filterOptions`), snapshot => {
  //     onFetchEnd(snapshot.val())
  //   })
  // }

  /**
   * fetch all properties data from local csv
   */
  fetchPropertyData (filterOptions, onFetchEnd) {
    if (this.properties && this.constituencies) {
      onFetchEnd(this.properties, this.constituencies)
      return
    }

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
            d['mrts'] = d['mrtID'].split(',').map((mID, i) => ({...STATIONS[mID], dist: distToMrts[i]}) )
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
          
          this.updateFilterDependVals(filterOptions)
          
          onFetchEnd(this.properties, this.constituencies)
      })
  }

  updateFilterDependVals (filterOptions) {
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
   * @param {String} name 
   * @returns {Property}
   */
  getPropertyByName(name) {
    return this.properties.filter(p => p.name === name)[0]
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
