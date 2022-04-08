import './styles/App.scss'

import { InfoPanelUI, SidePanelUI, MapUI, SearchBarUI, LoadingUI} from './components/boundaries'
import { HomeLogo } from './components/boundaries/MiscUI/MiscUI'
import {dbMgr, userAuthMgr} from './components/controls/Mgr'
import {getAuth} from "firebase/auth"
import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {addBookmarks} from './features/bookmarkSlice'
import {selectConstituency} from './features/selectionSlice'
import {setPageState} from './features/pageStateSlice'
import {setTriggerReset} from './features/triggerResetSlice'

// page state
// HOME             0
// Sign In          2
// Sign Up          3
// FORGOT PASSWORD 10
// ACCOUNT INFO     4
// BOOKMARK         5
// FILTER           6
// INFORMATION      7
// LOGOUT           9

// side panel in    8

/**
 * @namespace App
 * @description control module
//  * @property {integer} pageState state of the current page.
//  * @property {Boolean} showLightBox value to show the lightbox
//  * @property {SearchItem} curSearch current search item
//  * @property {Property} selectedProperty selected property
//  * @property {Constituency} selectedConstituency selected constituency
//  * @property {SearchItem[]} recentSearches a list of user's recent searches
//  * @property {object} filterOptions filter options
//  * @property {Property[]} bookmarks list of properties as user's bookmark
 * @property {User} activeUser current logged in user instance.
 * @property {Boolean} activeUserDataReady value to indicate if user data is ready
//  * @property {Boolean} sidePanelIn value to show/hide side panel
//  * @property {Boolean} subSidePanelIn value to show/hide the secondary side panel
//  * @property {Boolean} mapTriggerReset value to trigger a map display
 * @returns {FunctionalComponent}
 */

 function App() {
   console.log('render App')
  const dispatch = useDispatch()
  const [activeUser, setActiveUser] = useState(null)
  const [activeUserDataReady, setActiveUserDataReady] = useState(false)

    /**
    * @memberof App
    * @typedef {function} useEffect register authentication state change handler.
    * @param {function} callback Anonymous function invoked when the app first loaded.
    * @param {Array} watchList []
    */
  useEffect(() => {
    const auth = getAuth()
        // signOut(auth)
        auth.onAuthStateChanged(user => {
            if (user) {
                const {email, displayName: name, providerId} = user.providerData[0]
                const {emailVerified} = user
                const isGoogleAuth = providerId === 'google.com'
                userAuthMgr.setAuthUserInfo(user)
                console.log('auth change valid user', user)
                dbMgr.initActiveUser({
                  name,
                  email,
                  emailVerified: emailVerified || isGoogleAuth,
                  isGoogleAuth
                }, activeUser => {
                  setActiveUser(activeUser)
                })
            } else {
                console.log('no active user on auth change')
                setActiveUser(null)
                dbMgr.fetchPropertyData((properties, constituencies) => {
                  setActiveUserDataReady(true)
                })
            }
            
            // console.log('auth state change check', user)
        })
  }, [])

/**
 * @memberof App
 * @typedef {function} useEffect2 fetch properties and constituencies data
 * @param {function} callback Anonymous function invoked when value of states from watchlist is updated.
 * @param {Array} watchList [activeUser]
 */
  useEffect(() => {
    if (activeUser) {
      console.log('active user')

      dbMgr.fetchPropertyData((pps, ccs) => {
      // update bookmarks
      const bookmarkLists = []
      activeUser.bookmarks.forEach(bID => {
        const property = pps.filter(p => p.id === bID)[0]
        bookmarkLists.push(property)
        property.fetchGeneralInfo()
      })
      dispatch(addBookmarks({properties: bookmarkLists}))

        setActiveUserDataReady(true)
      })
    }
  }, [activeUser])


  /**
 * @memberof App
 * @typedef {function} onResetView invoked when user clicks the home button to reset the view.
 */
  const onResetView = () => {
    dispatch(selectConstituency(null)) // this set both selected constituency and selected property to null.
    dispatch(setPageState(0))
    dispatch(setTriggerReset())
  }

  if (!activeUserDataReady) return (<div className="loader"></div>)

  return (<div className="property-web-app">
      <MapUI></MapUI>
        <div className="navbar-container">
          <HomeLogo title="home" className="web-app-logo" fill='#FFFFFF' opacity={0.5} onClick={onResetView}></HomeLogo>
          <SearchBarUI activeUser={activeUser}></SearchBarUI>
          <SidePanelUI activeUser={activeUser}></SidePanelUI>
        </div>
        <InfoPanelUI activeUser={activeUser}></InfoPanelUI>
        <LoadingUI></LoadingUI>
    </div>);
}

export default App
