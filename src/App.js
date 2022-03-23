import './styles/App.scss'
import MapUI from './components/systemUI/MapUI/index'
// import SidePanelUI from './components/systemUI/SidePanelUI/index'
import SearchBarUI from './components/systemUI/SearchBarUI'
import LightBoxWrapper from './components/systemUI/LightboxWrapper/index'
import SidePanelWrapper from './components/systemUI/SidePanelWrapper'
import FilterPanelUI from "./components/systemUI/FilterPanelUI/index"
import BookmarkUI from './components/systemUI/BookmarkUI/index'
import InfoPanelUI from './components/systemUI/InfoPanelUI/index'
import LoginUI from './components/systemUI/LoginUI/index'
import { GreetUserMsg } from './components/systemUI/MiscUI'
import {dbMgr, sidePanelOptMgr} from './components/systemMgr/Mgr'
import { useGoogleAuth } from './components/systemMgr/GoogleAuth'
import {useEffect, useState} from 'react'

// page state
// HOME         1
// ZOOM IN      2
// LOGIN        3
// BOOKMARK     4
// FILTER       5
// INFORMATION  6
// LOGOUT       7
// ACCOUNT INFO 8
function App() {
  const {signIn, signOut, googleUser, isInitialized} = useGoogleAuth()
  const [isSignedOut, setIsSignedOut] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [pageState, setPageState] = useState(0)
  const [showLightBox, setShowLightbox] = useState(false)
  const [warningMsg, setWarningMsg] = useState(null)
  const [properties, setProperties] = useState([])
  const [selectedSearch, setSelectedSearch] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
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

  const addRecentSearch = (recentSearch, newSearch) => {
    recentSearch = recentSearch.filter(rs => rs.name !== newSearch.name)
    recentSearch.unshift(newSearch)
    if (recentSearch.length > 10) recentSearch.splice(10 - recentSearch.length)
    return recentSearch
  }

  

  useEffect(() => {
    if (googleUser && googleUser.profileObj) {
      // fetch user data
      const {name, email} = googleUser.profileObj
      dbMgr.initActiveUser(name, email, activeUser => {
        if (isRegistering) { // active user obtain via google register
          if (activeUser.registerViaGoogle) {
            console.log('account already register. auto login in via google')
          } else {
            dbMgr.updateUserData(activeUser, 'registerViaGoogle', true)
            dbMgr.updateUserData(activeUser, 'isVerified', true)
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

  useEffect(() => {
    let pps = dbMgr.getProperties()
    setProperties(pps)
    // console.log('active user', activeUser)
    if (activeUser) {
      // update recent search
      let curSearches = activeUser.recentSearchStr.map(pName => pps.filter(p => p.name === pName)[0]).filter(p => p)
      while (recentSearches.length > 0) {
        curSearches = addRecentSearch(curSearches, recentSearches.pop())
      }
      setRecentSearches(curSearches)
      // console.log('cur search', curSearches)
      dbMgr.updateUserData(activeUser, 'recentSearchStr', curSearches.map(s => s.name))

      // update bookmarks
      setBookmarks(activeUser.bookmarkStr.map(bName => pps.filter(p => p.name === bName)[0]))

      // for first load, set data ready to render the rest of UI
      setActiveUserDataReady(true)
    }
  }, [activeUser])

  useEffect(() => {
    console.log('google user')
  }, [googleUser])
    
  useEffect(() => {
    console.log('is initialised')
  }, [isInitialized])

  // useEffect(() => {
  //   console.log('is signed in')
  // }, [isSignedIn])
  const onSidePanelOptSelect = (newState) => {
    // if (newState === 4 && !activeUser) { // bookmark state
    //   setWarningMsg("Please login to access the bookmark feature.")
    // } else 
    if (newState === 7) { // logout state
      onLogOut()
    } else {
      setPageState(newState)
      setSidePanelIn(false)
      if (newState > 0) setShowLightbox(true)
    }
  }

  const onLightboxClose = () => {
    if (pageState === 6) { // information panel
      setSelectedSearch(null)
    } else if (pageState === 3) {
      setIsRegistering(false)
    }
    setPageState(0)
    setShowLightbox(false)
  }

  const onSearchChange = newSearchedProperty => {
    let curSearches = recentSearches
    curSearches = addRecentSearch(curSearches, newSearchedProperty)
    setRecentSearches(curSearches)
    dbMgr.updateUserData(activeUser, 'recentSearchStr', curSearches.map(s => s.name))

    setSelectedSearch(newSearchedProperty)
    setPageState(6)
    setShowLightbox(true)
  }

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
    dbMgr.updateUserData(activeUser, 'bookmarkStr', curBookmarks.map(b => b.name))
  }
  
  const removeAllBookmarks = () => {
    setBookmarks([])
    dbMgr.updateUserData(activeUser, 'bookmarkStr', [])
  }
  const isBookmarked = property => {
    if (!property) return false
    return bookmarks.filter(b => b === property).length > 0
  }

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

  const onFilterChange = newFilterOptions => {
    setFilterOptions(newFilterOptions) 
  }

  const onDistrictChange = newDistrict => {
    setSelectedDistrict(newDistrict)
  }

  const onResetView = () => {
    setSelectedSearch(null)
    setSelectedDistrict(null)
    setMapTriggerReset(!mapTriggerReset)
  }

  const onRegisterChange = newIsRegistering => {
    setIsRegistering(newIsRegistering)
  }

  const onRegisterManual = userInfo => {
    console.log('on register manual', userInfo)
  }

  const LightboxContent = () => {
    switch (pageState) {
      case 3:
        return (<LoginUI 
          onLogInGoogle={signIn}
          activeUser={activeUser}
          isRegistering={isRegistering}
          onRegisterChange={onRegisterChange}
          onRegisterManual={onRegisterManual}></LoginUI>)
      case 4:
        return (<BookmarkUI bookmarks={bookmarks} onBookmarkRemove={onBookmark} onBookmarkRemoveAll={removeAllBookmarks}></BookmarkUI>)
      case 5:
        return (<FilterPanelUI filterOptions={filterOptions} onFilterChange={onFilterChange}></FilterPanelUI>)
      case 6:
         return (<InfoPanelUI property={selectedSearch} enableBookmark={!!activeUser} isBookmarked={isBookmarked(selectedSearch)} onBookmark={onBookmark}></InfoPanelUI>)
        }
    return ''
  }

  if (!isInitialized || !activeUserDataReady) return (<div>Loading...</div>)
  return (<div className="property-web-app">
      <MapUI properties={properties} curDistrict={selectedDistrict} filterOptions={filterOptions} onPropertySelect={onSearchChange} onDistrictSelect={onDistrictChange} triggerReset={mapTriggerReset}></MapUI>
      <div className="navbar-container">
        <img className="web-app-logo" src={require('./images/pglogo.png')} onClick={onResetView}/>
        <SearchBarUI onChange={onSearchChange} selectedSearch={selectedSearch} recentSearches={recentSearches} properties={properties}></SearchBarUI>
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
      <LightBoxWrapper isOpen={showLightBox} onClose={onLightboxClose}>
        <LightboxContent></LightboxContent>
      </LightBoxWrapper>
        
      {/* Warning message for bookmark access when not login */}
      {!!warningMsg ?
        <LightBoxWrapper isOpen={!!warningMsg} hideCloseButton={true}>
          <div className="warning-msg-container">
            {warningMsg}
            <button onClick={() => setWarningMsg(null)}>Back</button>
          </div>
        </LightBoxWrapper>
      : ""}
      

      {/* Log out in progress message */}
      {pageState === 7 ?
        <LightBoxWrapper isOpen={pageState === 7} hideCloseButton={true}>
          <div className="logout-container">Log out...</div>
        </LightBoxWrapper>
      : ""}
    </div>);
}

export default App
