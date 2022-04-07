import './styles/App.scss'

import {BookmarkUI, FilterPanelUI, InfoPanelUI, LightBoxWrapper, LoginUI, RegisterUI, MapUI, SearchBarUI, AccountUI} from './components/boundaries/index'
import { GreetUserMsg, HomeLogo, SidePanelWrapper } from './components/boundaries/MiscUI/MiscUI'
import {dbMgr, sidePanelOptMgr, userAuthMgr} from './components/controls/Mgr'

import { useFirebaseAuth } from './components/controls/FirebaseAuth'
import {useEffect, useState} from 'react'
import {SearchItem} from './components/entities/index'
import { CONSTITUENCY_NAME } from './components/CONFIG'


// page state
// HOME         0
// LOGIN        2
// REGISTER     3
// ACCOUNT INFO 4
// BOOKMARK     5
// FILTER       6
// INFORMATION  7
// LOGOUT       9

/**
 * @namespace App
 * @description control module
 * @property {Boolean} isSignedOut value records user signed out activity
 * @property {Boolean} isRegistering value records user registration activity
 * @property {integer} pageState state of the current page.
 * @property {Boolean} showLightBox value to show the lightbox
 * @property {SearchItem} curSearch current search item
 * @property {Property} selectedProperty selected property
 * @property {Constituency} selectedConstituency selected constituency
 * @property {SearchItem[]} recentSearches a list of user's recent searches
 * @property {object} filterOptions filter options
 * @property {Property[]} bookmarks list of properties as user's bookmark
 * @property {User} activeUser current logged in user instance.
 * @property {Boolean} sidePanelIn value to show/hide side panel
 * @property {Boolean} subSidePanelIn value to show/hide the secondary side panel
 * @property {Boolean} mapTriggerReset value to trigger a map display
 * @returns {FunctionalComponent}
 */

let initCount = false

 function App() {
  const {authUserInfo, isInitialized} = useFirebaseAuth()
  const [pageState, setPageState] = useState(0)
  const [showLightBox, setShowLightbox] = useState(false)
  const [curSearch, setCurSearch] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [selectedConstituency, setSelectedConstituency] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    score: {label: 'Score', checked: true, threshold: 0},
    enbloc: {label: 'Enbloc', checked: true, threshold: 1},
    distToMrt: {label: 'Distance to MRT', checked: true, threshold: 4},
    distToSchool: {label: 'Distance to School', checked: true, threshold: 4}
  })

  const [bookmarks, setBookmarks] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [activeUserDataReady, setActiveUserDataReady] = useState(false)
  const [sidePanelIn, setSidePanelIn] = useState(false)
  const [subSidePanelIn, setSubSidePanelIn] = useState(false)
  const [sidePanelContent, setSidePanelContent] = useState(0)
  const [mapTriggerReset, setMapTriggerReset] = useState(false)


  /**
   * @memberof App
 * @typedef {function} useEffect1 fetch google auth session from previous login.
 * @param {function} callback Anonymous function invoked when value of states from watchlist is updated.
 * @param {Array} watchList [authUser]
 */
  useEffect(() => {
    if (isInitialized) {
      if (authUserInfo) {
        console.log('valid auth user info')
        dbMgr.initActiveUser(authUserInfo, activeUser => {
          setActiveUser(activeUser)
        })
      } else {
        if (!initCount) return
        console.log('no logged in user')
        dbMgr.fetchPropertyData(filterOptions, (properties, constituencies) => {
          setActiveUserDataReady(true)
        })
      }
    }
    initCount = true
  }, [authUserInfo, isInitialized])

/**
 * @memberof App
 * @typedef {function} useEffect2 fetch user datas(recent searches, bookmarks) when user login.
 * @param {function} callback Anonymous function invoked when value of states from watchlist is updated.
 * @param {Array} watchList [activeUser]
 */
  useEffect(() => {
    if (activeUser) {
      console.log('active user')
      setSubSidePanelIn(false)

      dbMgr.fetchPropertyData(filterOptions, (pps, ccs) => {
      // update recent search
      let tempSearches = activeUser.recentSearches
        .map(({type, id}) => {
          const searchObj = type === 'c' ? ccs[CONSTITUENCY_NAME[id].name] : pps.filter(p => p.id === id)[0]
          return new SearchItem(type, searchObj)
        })
        
      const localRecentSearches = [...recentSearches]
      while (localRecentSearches.length > 0) {
        tempSearches = addRecentSearch(tempSearches, localRecentSearches.pop())
      }
      setRecentSearches(tempSearches)
      dbMgr.updateUserDataDB(activeUser, 'recentSearches', tempSearches.map(s => ({type: s.type, id: s.value.id})))

      // update bookmarks
      const bookmarkLists = activeUser.bookmarks.map(bID => pps.filter(p => p.id === bID)[0])
      setBookmarks(bookmarkLists)
      bookmarkLists.forEach(b => {
        b.fetchGeneralInfo()
      })

        setActiveUserDataReady(true)
      })
    }
  }, [activeUser])

/**
 * @memberof App
 * @typedef {function} addRecentSearch append new search item onto user's searched item list.
 * @param {SearchItem[]} recentSearch A list of user recent searched items.
 * @param {SearchItem} newSearch User latest search item.
 */
  const addRecentSearch = (recentSearch, newSearch) => {
    recentSearch = recentSearch.filter(rs => rs.value.id !== newSearch.value.id)
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
    switch (newPageState) {
      case 2: // login
      case 4: // account info
      case 5: // bookmark
      case 6: // filter
        setSidePanelIn(false)
        setSidePanelContent(newPageState)
        setSubSidePanelIn(true)
        break
      case 9:
        setPageState(newPageState)
        onLogOut()
      break
    }
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
 * @typedef {function} onPropertySelect called when MapUI or BookmarkUI invokes a change in current selected property on the map.
 * @param {Property} newProperty latest selected constituency
 */
  const onPropertySelect = newProperty => {
    if (newProperty) setSelectedConstituency(newProperty.constituency)
    setSelectedProperty(newProperty)
    setSubSidePanelIn(false)
    setShowLightbox(true)
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
      return {type: cs.type, id: cs.value.id}
    })

    dbMgr.updateUserDataDB(activeUser, 'recentSearches', tempSearches)
    
    if (newSearch.type === 'c') {
      onConstituencySelectMap(newSearch.value)
    } else if (newSearch.type === 'p') {
      onConstituencySelectMap(newSearch.value.constituency)
      onPropertySelect(newSearch.value)
      setShowLightbox(true)
    }

    setSidePanelIn(false)
    setSubSidePanelIn(false)
    
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
    // wrong mutation like directly changing bookmarks, which is wrong since bookmarks is initialised via useState.
    // instead, deep copy(array) here would fix the issue
    let curBookmarks = [...bookmarks] 
    const targetIndex = getBookmarkIndex(property)
    
    if (isBookmarked && targetIndex < 0) {
      curBookmarks.unshift(property)
    } else if (!isBookmarked && targetIndex >= 0) {
      curBookmarks = [...curBookmarks.slice(0, targetIndex), ...curBookmarks.slice(targetIndex + 1, curBookmarks.length)]
    }
    setBookmarks(curBookmarks)
    dbMgr.updateUserDataDB(activeUser, 'bookmarks', curBookmarks.map(b => b.id))
  }
  
  /**
   * @memberof App
   * @typedef {function} removeAllBookmarks remove all user's bookmarks.
   */
  const removeAllBookmarks = () => {
    setBookmarks([])
    dbMgr.updateUserDataDB(activeUser, 'bookmarks', [])
  }

  /**
 * @memberof App
 * @typedef {function} onLogOut called when user clicks on log out button.
 */
  const onLogOut = () => {
    userAuthMgr.generalSignOut((success, err) => {
      if (success) {
        setTimeout(() => { // add a deplay during sign out
          setActiveUser(null)
          setSidePanelIn(false)
          setPageState(0)
          // localStorage.removeItem('activeUser')
        }, 1000)
      }
    })
    
  }

  /**
 * @memberof App
 * @typedef {function} onFilterChange invoked when user changes filter combination on the filter panel.
 * @param {object} newFilterOptions new filter combination
 */
  const onFilterChange = newFilterOptions => {
    dbMgr.updateFilterDependVals(newFilterOptions)
    setFilterOptions(newFilterOptions)
  }

  /**
 * @memberof App
 * @typedef {function} onResetView invoked when user clicks the home button to reset the view.
 */
  const onResetView = () => {
    setSelectedProperty(null)
    setSelectedConstituency(null)
    setPageState(0)
    setShowLightbox(false)
    setSidePanelIn(false)
    setSubSidePanelIn(false)
    setMapTriggerReset(!mapTriggerReset)
  }

/**
 * @memberof App
 * @typedef {FunctionalComponent} SidePanelSubContent a functional component rendering lightbox content based on current page state.
 */
  const SidePanelSubContent = () => {
    switch (sidePanelContent) {
      case 2:
        return (
          <LoginUI 
            activeUser={activeUser}>
              <div className="register-info-container">
                {"Does not have an account?"} <span className="register-ui-entry-button text-button" onClick={() => setSidePanelContent(3)}>Sign up</span>
              </div>
            </LoginUI>
            )
        case 3:
          return (
            <RegisterUI 
              onBack={() => {
                setSidePanelContent(2)
                setPageState(2)
              }}></RegisterUI>
          )
      case 4:
        return activeUser ? <AccountUI user={activeUser}></AccountUI> : ''
      case 5:
        return (<BookmarkUI
            bookmarks={bookmarks}
            filterOptions={filterOptions}
            onPropertySelect={onPropertySelect}
            onBookmarkRemove={onBookmark}
            onBookmarkRemoveAll={removeAllBookmarks}></BookmarkUI>)
      case 6:
        return (<FilterPanelUI filterOptions={filterOptions} onFilterChange={onFilterChange}></FilterPanelUI>)
      }
    return ''
  }

  if (!activeUserDataReady) return (<div className="loader"></div>)

  return (<div className="property-web-app">
      <MapUI
        filterOptions={filterOptions}
        curConstituency={selectedConstituency}
        curProperty={selectedProperty}
        onPropertySelect={onPropertySelect}
        onConstituencySelect={onConstituencySelectMap}
        triggerReset={mapTriggerReset}></MapUI>
      <div className="navbar-container">
        <HomeLogo title="home" className="web-app-logo" fill='#FFFFFF' opacity={0.5} onClick={onResetView}></HomeLogo>
        <SearchBarUI
          selectedSearch={curSearch}
          recentSearches={recentSearches}
          onSearchChange={onSearchChange}
          ></SearchBarUI>
        <GreetUserMsg alwaysShow={sidePanelIn} activeUser={activeUser}></GreetUserMsg>
        <SidePanelWrapper
          isOpen={sidePanelIn}
          onClose={() => {setSidePanelIn(false)}}
          onToggle={() => {
              setSidePanelIn(!sidePanelIn)
              if (!sidePanelIn) setSubSidePanelIn(false)
            }}>
          {sidePanelOptMgr.getOptionItems(activeUser).map((opt, i) => 
              <div className="side-panel-option noselect" key={i}
              onClick={() => onSidePanelOptSelect(opt.state)}>{opt.label}</div>)
          }
        </SidePanelWrapper>
      </div>
      
      {showLightBox && selectedProperty ? 
        <LightBoxWrapper isOpen={true} onClose={() => setSelectedProperty(null)}>
          <InfoPanelUI
            isBookmarked={bookmarks.filter(b => b === selectedProperty).length > 0}
            enableBookmark={!!activeUser}
            filterOptions={filterOptions}
            selectedProperty={selectedProperty}
            onBookmark={onBookmark}
            onLocateProperty={() => setShowLightbox(false)}></InfoPanelUI>
        </LightBoxWrapper>
      : ''}

      <SidePanelWrapper
        className="sub-side-panel-content"
        isOpen={subSidePanelIn}
        hideCloseButton={true}
        onClose={() => setSubSidePanelIn(false)}>
          <SidePanelSubContent></SidePanelSubContent>
      </SidePanelWrapper>

      {/* Log out in progress message */}
      {pageState === 9 ?
        <LightBoxWrapper className="logout-lightbox" isOpen={true} hideCloseButton={true} disableClose={true}>
          <div className="loader"></div>
          <div className="logout-container">Log out...</div>
        </LightBoxWrapper>
      : ""}
    </div>);
}

export default App
