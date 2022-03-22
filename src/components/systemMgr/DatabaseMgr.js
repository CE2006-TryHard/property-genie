import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {getDatabase, ref, onValue, update} from 'firebase/database'
import Papa from 'papaparse'
import User from "../entities/User"
import Property from '../entities/Property'
import District, {DISTRICT_NAME} from "../entities/District"

export default class DatabaseMgr {
  constructor () {
    this.properties = []
    this.districts = {}
    this.fetchPropertyData()
    this.initFirebase()
    
  }

  initActiveUser(name, email, onFetchEnd) {
    const newUser = new User(name, email, true)
    const db = getDatabase()
    onValue(ref(db, `account/${newUser.id}`), snapshot => {
      const {recentSearchStr, bookmarkStr, filterOptions} = snapshot.val()
      newUser.recentSearchStr = recentSearchStr || []
      newUser.bookmarkStr = bookmarkStr || []
      // newUser.filterOptions = filterOptions || []

      onFetchEnd(newUser)
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
    // this.updateUserData('recent', 'house')
  }

  fetchAllUserData(userId, onFetchEnd) {
    const db = getDatabase()
    onValue(ref(db, `account/${userId}`), snapshot => {
      onFetchEnd(snapshot.val())
    })
  }

  updateUserData(user, key, value) {
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
          .filter(d => d['valid postal'] > 0 && d['enbloc'] !== 'null' && d['district'] !== '')
          .forEach(d => {
            d['lat'] = parseFloat(d['lat'])
            d['lng'] = parseFloat(d['lng'])
            d['description'] = 'Lorem Ipsum asd asd asd asd.'
  
            const distToMrts = d['distToMrt'].split(',').map(distStr => parseFloat(distStr))
            const mrtObj = d['mrt'].split(',').reduce((acc, mrtName, i) => {
              acc[mrtName] = distToMrts[i]
              return acc
            }, {})
            d['mrt'] = mrtObj
            d['avgMrtDist'] = (Object.keys(mrtObj).reduce((acc, mrtName) => {
              acc += mrtObj[mrtName]
              return acc
            }, 0) / distToMrts.length).toFixed(3)

            const distToSchools = d['distToSchool'].split(',').map(distStr => parseFloat(distStr))
            const schoolObj = d['school'].split(',').reduce((acc, schoolName, i) => {
              acc[schoolName] = distToSchools[i]
              return acc
            }, {})
            d['school'] = schoolObj
            d['avgSchoolDist'] = (Object.keys(schoolObj).reduce((acc, schoolName) => {
              acc += schoolObj[schoolName]
              return acc
            }, 0) / distToSchools.length).toFixed(3)
            
            const p = new Property(d)
            this.properties.push(p)
            const districtID = parseInt(d['district'])
            let districtName = DISTRICT_NAME[districtID].name
            if (!this.districts[districtName]) this.districts[districtName] = new District(districtName)
            p.district = this.districts[districtName]
            this.districts[districtName].properties.push(p)

          })

          // some of the district does not have any properties in database
          Object.keys(DISTRICT_NAME).forEach(dID => {
            const dName = DISTRICT_NAME[dID].name
            if (!this.districts[dName]) {
              this.districts[dName] = new District(dName)
            }
            this.districts[dName].avgPropertiesCount = this.properties.length / 31
          })
        console.log(this.districts)
      })
  }

  getProperties () {
    return this.properties
  }

  getPropertiesByName(name) {
    return this.properties.filter(p => p.name === name)[0]
  }

  getDistricts () {
    return this.districts
  }

}