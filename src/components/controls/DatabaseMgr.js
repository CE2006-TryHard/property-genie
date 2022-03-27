import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {getDatabase, ref, child, onValue, update, get} from 'firebase/database'
import Papa from 'papaparse'
import User from "../entities/User"
import Property from '../entities/Property'
import Constituency, {CONSTITUENCY_NAME} from "../entities/Constituency"
import {ENBLOC, STATIONS, LINES, SCHOOLS} from '../CONFIG'

export default class DatabaseMgr {
  constructor () {
    this.properties = []
    this.constituencies = {}
    this.fetchPropertyData()
    this.initFirebase()
    
  }

  initActiveUser(name, email, onFetchEnd) {
    const newUser = new User(name, email)
    const dbRef = ref(getDatabase())
    get(child(dbRef, `account/${newUser.id}`)).then(snapshot => {
      if (snapshot.exists()) {
        const {recentSearchStr, bookmarkStr, isVerified, registerViaGoogle} = snapshot.val()
        newUser.isVerified = isVerified
        newUser.registerViaGoogle = registerViaGoogle || false
        newUser.recentSearchStr = recentSearchStr || []
        newUser.bookmarkStr = bookmarkStr || []

        onFetchEnd(newUser)
      } else {
        console.log('no data available')
      }
    })
    // onValue(ref(db, ), snapshot => {
    //   const {recentSearchStr, bookmarkStr, isVerified, registerViaGoogle} = snapshot.val()
    //   newUser.isVerified = isVerified
    //   newUser.registerViaGoogle = registerViaGoogle || false
    //   newUser.recentSearchStr = recentSearchStr || []
    //   newUser.bookmarkStr = bookmarkStr || []
    //   // newUser.filterOptions = filterOptions || []

    //   onFetchEnd(newUser)
    //   console.log('magic!')
    // })
  }

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


  fetchPropertyData () {
    // fetch all property data at once
    fetch('data/data-all.csv')
      .then(res => res.text())
      .then(raw => Papa.parse(raw, {header: true}))
      .then(parsedRaw => {
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
            
            if (!this.constituencies[constituencyName]) this.constituencies[constituencyName] = new Constituency(constituencyName)
            p.constituency = this.constituencies[constituencyName]
            this.constituencies[constituencyName].properties.push(p)

          })

          // some of the constituency may not have any properties in database
          Object.keys(CONSTITUENCY_NAME).forEach(dID => {
            const dName = CONSTITUENCY_NAME[dID].name
            if (!this.constituencies[dName]) {
              this.constituencies[dName] = new Constituency(dName)
            }
            this.constituencies[dName].avgPropertiesCount = this.properties.length / 31
          })
        // console.log(this.constituencies)
      })
  }

  getProperties () {
    return this.properties
  }

  getPropertyByName(name) {
    return this.properties.filter(p => p.name === name)[0]
  }

  getConstituencies () {
    return this.constituencies
  }

}