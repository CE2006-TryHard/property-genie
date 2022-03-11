// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import {getDatabase, ref, set, onValue, update} from 'firebase/database'
import Papa from 'papaparse'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export default class DatabaseMgr {
  constructor () {
    this.properties = []
    this.initFirebase()
    this.fetchPropertyData()
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
    const analytics = getAnalytics(app)
    this.firebaseDB = getDatabase(app)

    // test fetch data
    // this.fetchUserData('wx', userData => {
    //   console.log('userData', userData)
    // })

    // test update data
    // this.updateUserData('wx', 'recent', 'house')
  }

  fetchUserData(userId, onFetchEnd) {
    const db = getDatabase()
    onValue(ref(db, `account/${userId}`), snapshot => {
      onFetchEnd( snapshot.val())
    })
  }

  updateUserData(userId, key, value) {
    const updates = {}
    const db = getDatabase()
    updates[`account/${userId}/${key}`] = value
    
    return update(ref(db), updates)
  }

  fetchFilterData (onFetchEnd) {
    const db = getDatabase()
    onValue(ref(db, `filterOptions`), snapshot => {
      onFetchEnd(snapshot.val())
    })
  }


  fetchPropertyData () {
    // fetch all property data at once
    fetch('data/data-all.csv')
      .then(res => res.text())
      .then(raw => Papa.parse(raw, {header: true}))
      .then(parsedRaw => {
        this.properties = parsedRaw.data
          .filter(d => d['valid postal'] > 0)
          .map(d => {
          d['description'] = 'Lorem Ipsum asd asd asd asd.'
          d['distToMrt'] = 1
          d['distToSchool'] = 2
          return d
        })
        
        console.log(this.properties)
      })
  }

  getProperties () {
    return this.properties
  }

}