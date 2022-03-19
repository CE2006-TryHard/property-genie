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
import {dbMgr, filterMgr, sidePanelOptMgr} from './components/systemMgr/Mgr'
import { useGoogleAuth } from './components/systemMgr/GoogleAuth'
import {useEffect, useState} from 'react'

// page state
// HOME         1
// ZOOM IN      2
// LOGIN        3
// BOOKMARK     4
// FILTER       5
// INFORMATION  6

function App() {
  const {signIn, signOut, googleUser, isInitialized} = useGoogleAuth()

  const [pageState, setPageState] = useState(0)
  const [showLightBox, setShowLightbox] = useState(false)
  const [properties, setProperties] = useState([])
  const [selectedSearch, setSelectedSearch] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    enbloc: {label: 'Enbloc', checked: false},
    distToMRT: {label: 'Distance to MRT', checked: false},
    distToSchool: {label: 'Distance to School', checked: false}
  })
  const [bookmarks, setBookmarks] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [activeUserDataReady, setActiveUserDataReady] = useState(false)
  const [sidePanelIn, setSidePanelIn] = useState(false)

  const addRecentSearch = (recentSearch, newSearch) => {
    recentSearch = recentSearch.filter(rs => rs.name !== newSearch.name)
    recentSearch.unshift(newSearch)
    if (recentSearch.length > 10) recentSearch.splice(10 - recentSearch.length)
    return recentSearch
  }

  

  useEffect(() => {
    if (googleUser && googleUser.profileObj) {
      // set all properties data
      let pps = dbMgr.getProperties()
      setProperties(pps)
  
      // fetch user data
      const {name, email} = googleUser.profileObj
      dbMgr.initActiveUser(name, email, activeUser => {
  
        setActiveUser(activeUser)
        // update recent search
        let curSearches = activeUser.recentSearchStr.map(pName => pps.filter(p => p.name === pName)[0]).filter(p => p)
        while (recentSearches.length > 0) {
          curSearches = addRecentSearch(curSearches, recentSearches.pop())
        }
        setRecentSearches(curSearches)
        console.log('cur search', curSearches)
        dbMgr.updateUserData(activeUser, 'recentSearchStr', curSearches.map(s => s.name))

        // update bookmarks
        setBookmarks(activeUser.bookmarkStr.map(bName => pps.filter(p => p.name === bName)[0]))

        // for first load, set data ready to render the rest of UI
        setActiveUserDataReady(true)
      })
      onLightboxClose()
    } else if (isInitialized) {
      setActiveUserDataReady(true)
    }
  }, [googleUser, isInitialized])

  const onSidePanelOptSelect = (newState) => {
    setPageState(newState)
    if (newState > 0) setShowLightbox(true)
    setSidePanelIn(false)
  }

  const onLightboxClose = () => {
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
    let curBookmarks = bookmarks
    const targetIndex = getBookmarkIndex(property)

    if (isBookmarked && targetIndex < 0) {
      curBookmarks.push(property)
    } else if (!isBookmarked && targetIndex >= 0) {
      curBookmarks = [...curBookmarks.slice(0, targetIndex), ...curBookmarks.slice(targetIndex + 1, curBookmarks.length - 1)]
    }
    setBookmarks(curBookmarks)
    console.log(curBookmarks)
    dbMgr.updateUserData(activeUser, 'bookmarkStr', curBookmarks.map(b => b.name))
  }

  const isBookmarked = property => {
    if (!property) return false
    return bookmarks.filter(b => b.name === property.name).length > 0
  }

  const onLogOut = () => {
    signOut()
    setActiveUser(null)
    // localStorage.clear()
    onLightboxClose()
    setSidePanelIn(false)
  }

  const onFilterChange = () => {

  }

  const LightboxContent = () => {
    switch (pageState) {
      case 3:
        return (<LoginUI onLogIn={signIn}></LoginUI>)
      case 4:
        return (<BookmarkUI bookmarks={bookmarks}></BookmarkUI>)
      case 5:
        return (<FilterPanelUI filterOptions={filterOptions} onFilterChange={onFilterChange}></FilterPanelUI>)
      case 6:
         return (<InfoPanelUI property={selectedSearch} enableBookmark={!!activeUser} isBookmarked={isBookmarked(selectedSearch)} onBookmark={onBookmark}></InfoPanelUI>)
    }
    return ''
  }

  if (!isInitialized || !activeUserDataReady) return (<div>Loading...</div>)
  return (<div className="property-web-app">
      <MapUI properties={properties} ></MapUI>
      <div className="navbar-container">
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
          {activeUser ? <button onClick={onLogOut}>Logout with Google</button> : ''}
        </SidePanelWrapper>
      </div>
      <LightBoxWrapper isOpen={showLightBox} onClose={onLightboxClose}>
        <LightboxContent></LightboxContent>
      </LightBoxWrapper>
      
    </div>);
}

export default App
