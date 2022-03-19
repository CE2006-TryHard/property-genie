import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {getDatabase, ref, onValue, update} from 'firebase/database'
import Papa from 'papaparse'
import User from "../entities/User"
import Property from '../entities/Property'
import District from "../entities/District"

export default class DatabaseMgr {
  constructor () {
    // this.activeUser = null
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
      newUser.filterOptions = filterOptions || []

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
            d['description'] = 'Lorem Ipsum asd asd asd asd.'
            d['distToMrt'] = 1
            d['distToSchool'] = 2
            const p = new Property(d)
            this.properties.push(p)

            const districtID = parseInt(d['district'])
            if (!this.districts[districtID]) this.districts[districtID] = new District(districtID)
            this.districts[districtID].properties.push(p)

          })
        console.log(this.properties)
      })
  }

  getProperties () {
    return this.properties
  }

  getDistricts () {
    return this.districts
  }

}