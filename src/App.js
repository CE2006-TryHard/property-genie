import './styles/App.scss'

import {BookmarkUI, FilterPanelUI, InfoPanelUI, LightBoxWrapper, LoginUI, MapUI, SearchBarUI} from './components/boundaries/index'
import { GreetUserMsg, HomeLogo, SidePanelWrapper } from './components/boundaries/MiscUI'
import {dbMgr, sidePanelOptMgr} from './components/controls/Mgr'

import { useGoogleAuth } from './components/controls/GoogleAuth'
import {useEffect, useState} from 'react'
import {SearchItem} from './components/entities/index'

// page state
// HOME         1
// ZOOM IN      2
// LOGIN        3
// BOOKMARK     4
// FILTER       5
// INFORMATION  6
// LOGOUT       7
// ACCOUNT INFO 8
/**
 * @namespace App
 * @description control module
 * @property {Boolean} isSignedOut value records user signed out activity
 * @property {Boolean} isRegistering value records user registration activity
 * @property {integer} pageState state of the current page.
 * @property {Boolean} showLightBox value to show the lightbox
 * @property {Property[]} properties list of all properties
 * @property {SearchItem} curSearch current search item
 * @property {Property} selectedProperty selected property
 * @property {Constituency} selectedConstituency selected constituency
 * @property {SearchItem[]} recentSearches a list of user's recent searches
 * @property {object} filterOptions filter options
 * @property {Property[]} bookmarks list of properties as user's bookmark
 * @property {User} activeUser current logged in user instance.
 * @property {Boolean} sidePanelIn value to show/hide side panel
 * @property {Boolean} mapTriggerReset value to trigger a map display
 * @returns {FunctionalComponent}
 */
 function App() {
  const {signIn: googleSignIn, signOut, googleUser, isInitialized} = useGoogleAuth()

  const [isSignedOut, setIsSignedOut] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [pageState, setPageState] = useState(0)
  const [showLightBox, setShowLightbox] = useState(false)
  const [properties, setProperties] = useState([])
  const [curSearch, setCurSearch] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [selectedConstituency, setSelectedConstituency] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    enbloc: {label: 'Enbloc', checked: true},
    distToMrt: {label: 'Distance to MRT', checked: false},
    distToSchool: {label: 'Distance to School', checked: false}
  })
  const [bookmarks, setBookmarks] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [activeUserDataReady, setActiveUserDataReady] = useState(false)
  const [sidePanelIn, setSidePanelIn] = useState(false)
  const [mapTriggerReset, setMapTriggerReset] = useState(false)


  /**
   * @memberof App
 * @typedef {function} useEffect1 fetch google auth session from previous login.
 * @param {function} callback Anonymous function invoked when value of states from watchlist is updated.
 * @param {Array} watchList [googleUser, isInitialized]
 */
  useEffect(() => {
    if (googleUser && googleUser.profileObj) {
      // fetch user data
      const {name, email} = googleUser.profileObj
      dbMgr.initActiveUser(name, email, activeUser => {
        if (isRegistering) { // active user obtain via google register
          if (activeUser.registerViaGoogle) {
            console.log('account already register. auto login in via google')
          } else {
            dbMgr.updateUserDataDB(activeUser, 'registerViaGoogle', true)
            dbMgr.updateUserDataDB(activeUser, 'isVerified', true)
            console.log('on finish register via google')
          }
          
        }
        setActiveUser(activeUser)
        setIsSignedOut(false)
      })
      onLightboxClose()
    } else if (isInitialized && !isSignedOut) {
      // no active google account login session
      // check if local storage contain manual email login record
      const localUser = localStorage.getItem('activeUser')
      if (localUser) {
        console.log('found local user')
        const {name, email} = localUser
        dbMgr.initActiveUser(name, email, activeUser => {
          setActiveUser(activeUser)
          setIsSignedOut(false)
        })
      } else {
        // logged out state
        setActiveUserDataReady(true)
       
      }
      // const activeUser
    }
  }, [googleUser, isInitialized])

/**
 * @memberof App
 * @typedef {function} useEffect2 fetch user datas(recent searches, bookmarks) when user login.
 * @param {function} callback Anonymous function invoked when value of states from watchlist is updated.
 * @param {Array} watchList [activeUser]
 */
  useEffect(() => {
    let pps = dbMgr.getProperties()
    let ccs = dbMgr.getConstituencies()
    setProperties(pps)
    
    if (activeUser) {
      // update recent search
      let tempSearches = activeUser.recentSearchStr
        .map(({type, name}) => {
          const searchObj = type === 'c' ? ccs[name] : pps.filter(p => p.name === name)[0]
          // console.log(type, searchObj)
          return new SearchItem(type, searchObj)
        })
        
        // .map(pName => pps.filter(p => p.name === pName)[0]).filter(p => p)
      while (recentSearches.length > 0) {
        tempSearches = addRecentSearch(tempSearches, recentSearches.pop())
      }
      setRecentSearches(tempSearches)
      // console.log(tempSearches)
      dbMgr.updateUserDataDB(activeUser, 'recentSearchStr', tempSearches.map(s => ({type: s.type, name: s.name})))

      // update bookmarks
      setBookmarks(activeUser.bookmarkStr.map(bName => pps.filter(p => p.name === bName)[0]))

      // for first load, set data ready to render the rest of UI
      setActiveUserDataReady(true)
    }
  }, [activeUser])

  /**
   * Testing purpose only
   */
  useEffect(() => {
    console.log('google user')
  }, [googleUser])
  
  /**
   *  Testing purpose only
   */
  useEffect(() => {
    console.log('is initialised')
  }, [isInitialized])

  // useEffect(() => {
  //   console.log('is signed in')
  // }, [isSignedIn])

/**
 * @memberof App
 * @typedef {function} addRecentSearch append new search item onto user's searched item list.
 * @param {SearchItem[]} recentSearch A list of user recent searched items.
 * @param {SearchItem} newSearch User latest search item.
 */
  const addRecentSearch = (recentSearch, newSearch) => {
    recentSearch = recentSearch.filter(rs => rs.name !== newSearch.name)
    recentSearch.unshift(newSearch)
    if (recentSearch.length > 10) recentSearch.splice(10 - recentSearch.length)
    return recentSearch
  }

/**
 * @memberof App
 * @typedef {function} onSidePanelOptSelect called when user click on one of the option on the side panel menu. Update page state.
 * @param {integer} newPageState new page state index.
 */
  const onSidePanelOptSelect = (newPageState) => {
    if (newPageState === 7) { // logout state
      onLogOut()
    } else {
      setPageState(newPageState)
      setSidePanelIn(false)
      if (newPageState > 0) setShowLightbox(true)
    }
  }

/**
 * @memberof App
 * @typedef {function} onLightboxClose called when user clicks on lightbox's close button/area.
 */
  const onLightboxClose = () => {
    if (pageState === 3) {
      setIsRegistering(false)
    }
    setPageState(0)
    setShowLightbox(false)
  }

/**
 * @memberof App
 * @typedef {function} onConstituencySelectMap called when MapUI invokes a change in current selected constituency on the map.
 * @param {Constituency} newConstituency latest selected constituency
 */
  const onConstituencySelectMap = newConstituency => {
    setSelectedProperty(null)
    setSelectedConstituency(newConstituency)
    setPageState(0)
  }

/**
 * @memberof App
 * @typedef {function} onPropertySelectMap called when MapUI invokes a change in current selected property on the map.
 * @param {Property} newProperty latest selected constituency
 */
  const onPropertySelectMap = newProperty => {
    setSelectedProperty(newProperty)
    setPageState(6)
  }

/**
 * @memberof App
 * @typedef {function} onSearchChange called when SearchUI invokes a change in current selected SearchItem.
 * @param {SearchItem} newSearch latest searched item
 */
  const onSearchChange = newSearch => {
    let tempSearches = [...recentSearches]
    tempSearches = addRecentSearch(tempSearches, newSearch)
    setRecentSearches(tempSearches)
    setCurSearch(newSearch)
    tempSearches = tempSearches.map(cs => {
      return {type: cs.type, name: cs.name}
    })

    dbMgr.updateUserDataDB(activeUser, 'recentSearchStr', tempSearches)
    
    if (newSearch.type === 'c') {
      onConstituencySelectMap(newSearch.value)
    } else if (newSearch.type === 'p') {
      onPropertySelectMap(newSearch.value)
    }

    setShowLightbox(false)
    setSidePanelIn(false)
    
  }

/**
 * @memberof App
 * @typedef {function} getBookmarkIndex retrieve a bookmark's index within  the bookmark list.
 * @param {Property} property property to be checked within the bookmark list.
 * @returns {integer}
 */
  const getBookmarkIndex = property => {
    let targetIndex = -1
    bookmarks.every((b, i) => {
      if (b.name === property.name) {
        targetIndex = i
        return false
      }
      return true
    })

    return targetIndex
  }

  /**
 * @memberof App
 * @typedef {function} onBookmark called when user bookmarks a property/revert the bookmarking action.
 * @param {Property} property property to be checked within the bookmark list.
 * @param {Boolean} isBookmarked whether the property is bookmarked or not.
 */
  const onBookmark = (property, isBookmarked) => {
    // do not do curBookmarks = bookmarks as any changes toward curBookmarks leads to wrong mutation of bookmarks
    // wrong mutation like directly changing bookmarks, which is wrong since bookmarks is based on hook
    // instead, deep copy(array) here would fix the issue
    let curBookmarks = [...bookmarks] 
    const targetIndex = getBookmarkIndex(property)
    
    if (isBookmarked && targetIndex < 0) {
      curBookmarks.unshift(property)
    } else if (!isBookmarked && targetIndex >= 0) {
      curBookmarks = [...curBookmarks.slice(0, targetIndex), ...curBookmarks.slice(targetIndex + 1, curBookmarks.length)]
    }
    setBookmarks(curBookmarks)
    dbMgr.updateUserDataDB(activeUser, 'bookmarkStr', curBookmarks.map(b => b.name))
  }
  
  /**
   * @memberof App
   * @typedef {function} removeAllBookmarks remove all user's bookmarks.
   */
  const removeAllBookmarks = () => {
    setBookmarks([])
    dbMgr.updateUserDataDB(activeUser, 'bookmarkStr', [])
  }

  /**
 * @memberof App
 * @typedef {function} isBookmarked check if a property had been bookmarked.
 * @param {Property} property property to be checked
 * @returns {Boolean}
 */
  const isBookmarked = property => {
    if (!property) return false
    return bookmarks.filter(b => b === property).length > 0
  }

  /**
 * @memberof App
 * @typedef {function} onLogOut called when user clicks on log out button.
 */
  const onLogOut = () => {
    setPageState(7)
    setTimeout(() => {
      signOut()
      setActiveUser(null)
      localStorage.removeItem('activeUser')
      setSidePanelIn(false)
      setPageState(0)
      setIsSignedOut(true)
    }, 1000)
    
  }

  /**
 * @memberof App
 * @typedef {function} onFilterChange invoked when user changes filter combination on the filter panel.
 * @param {object} newFilterOptions new filter combination
 */
  const onFilterChange = newFilterOptions => {
    setFilterOptions(newFilterOptions) 
  }

  /**
 * @memberof App
 * @typedef {function} onResetView invoked when user clicks the home button to reset the view.
 */
  const onResetView = () => {
    setSelectedProperty(null)
    setPageState(0)
    setShowLightbox(false)
    setSelectedConstituency(null)
    setSidePanelIn(false)
    setMapTriggerReset(!mapTriggerReset)
  }

/**
 * @memberof App
 * @typedef {function} onRegisterChange called when page changes between registerUI and not registerUI
 * @param {Boolean} newIsRegistering set isRegistering value.
 */
  const onRegisterChange = newIsRegistering => {
    setIsRegistering(newIsRegistering)
  }

  /**
 * @memberof App
 * @typedef {function} onRegisterManual called when user submit registration request via manual mode.
 * @param {object} userInfo user information required for registration
 */
  const onRegisterManual = userInfo => {
    console.log('on register manual', userInfo)
  }

/**
 * @memberof App
 * @typedef {FunctionalComponent} LightboxContent a functional component rendering lightbox content based on current page state.
 */
  const LightboxContent = () => {
    switch (pageState) {
      case 3:
        return (<LoginUI 
          onLogInGoogle={googleSignIn}
          activeUser={activeUser}
          isRegistering={isRegistering}
          onRegisterChange={onRegisterChange}
          onRegisterManual={onRegisterManual}></LoginUI>)
      case 4:
        return (<BookmarkUI
            bookmarks={bookmarks}
            filterOptions={filterOptions}
            onBookmarkRemove={onBookmark}
            onBookmarkRemoveAll={removeAllBookmarks}></BookmarkUI>)
      case 5:
        return (<FilterPanelUI filterOptions={filterOptions} onFilterChange={onFilterChange}></FilterPanelUI>)
        }
    return ''
  }

  if (!isInitialized || !activeUserDataReady) return (<div>Loading...</div>)

  return (<div className="property-web-app">
      <MapUI
        properties={properties}
        curConstituency={selectedConstituency}
        filterOptions={filterOptions}
        onPropertySelect={onPropertySelectMap}
        onConstituencySelect={onConstituencySelectMap}
        triggerReset={mapTriggerReset}></MapUI>
      <div className="navbar-container">
        <HomeLogo title="home" className="web-app-logo" fill='#FFFFFF' opacity={0.5} onClick={onResetView}></HomeLogo>
        <SearchBarUI
          onSearchChange={onSearchChange}
          selectedSearch={curSearch}
          recentSearches={recentSearches}
          properties={properties}
          ></SearchBarUI>
        <GreetUserMsg alwaysShow={sidePanelIn} activeUser={activeUser}></GreetUserMsg>
        <SidePanelWrapper
          isOpen={sidePanelIn}
          onClose={() => setSidePanelIn(false)}
          onToggle={() => setSidePanelIn(!sidePanelIn)}>
          {sidePanelOptMgr.getOptionItems(activeUser).map((opt, i) => 
              <div className="side-panel-option" key={i}
              onClick={() => onSidePanelOptSelect(opt.state)}>{opt.label}</div>)
          }
        </SidePanelWrapper>
      </div>

      {selectedProperty ? 
        <LightBoxWrapper isOpen={true} onClose={() => setSelectedProperty(null)}>
          <InfoPanelUI
            filterOptions={filterOptions}
            property={selectedProperty}
            enableBookmark={!!activeUser}
            isBookmarked={isBookmarked(selectedProperty)}
            onBookmark={onBookmark}></InfoPanelUI>
        </LightBoxWrapper>
      : ''}

      <LightBoxWrapper isOpen={showLightBox} onClose={onLightboxClose}>
        <LightboxContent></LightboxContent>
      </LightBoxWrapper>

      {/* Log out in progress message */}
      {pageState === 7 ?
        <LightBoxWrapper isOpen={pageState === 7} hideCloseButton={true}>
          <div className="logout-container">Log out...</div>
        </LightBoxWrapper>
      : ""}
    </div>);
}

export default App
