import './styles/App.scss'
import MapUI from './components/systemUI/MapUI/index'
// import SidePanelUI from './components/systemUI/SidePanelUI/index'
import SearchBarUI from './components/systemUI/SearchBarUI'
import LightBoxWrapper from './components/systemUI/LightboxWrapper/index'
import SidePanelWrapper from './components/systemUI/SidePanelWrapper'
import FilterPanelUI from "./components/systemUI/FilterPanelUI/index"
import InfoPanelUI from './components/systemUI/InfoPanelUI/index'
import LoginUI from './components/systemUI/LoginUI/index'
import { GreetUserMsg } from './components/systemUI/MiscUI'
import {userInfoMgr, sidePanelOptMgr} from './components/systemMgr/GlobalContext'
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
  const {signIn, signOut, googleUser} = useGoogleAuth()

  const [pageState, setPageState] = useState(0)
  const [showLightBox, setShowLightbox] = useState(false)
  const [selectedSearch, setSelectedSearch] = useState(null)
  const [activeUser, setActiveUser] = useState(null)
  const [sidePanelIn, setSidePanelIn] = useState(false)

  useEffect(() => {
    if (googleUser && googleUser.profileObj) {
      setActiveUser(userInfoMgr.setActiveUser(googleUser.profileObj))
      onLightboxClose()
    }
  }, [googleUser])

  const onSidePanelOptSelect = (newState) => {
    setPageState(newState)
    if (newState > 0) {
      setShowLightbox(true)
    }
    setSidePanelIn(false)
  }

  const onLightboxClose = () => {
    setPageState(0)
    setShowLightbox(false)
  }

  const onSearchChange = newSelection => {
    setSelectedSearch(newSelection)
    setPageState(6)
    setShowLightbox(true)
  }

  const onLogOut = () => {
    signOut()
    setActiveUser(null)
    // localStorage.clear()
    onLightboxClose()
    setSidePanelIn(false)
  }

  const LightboxContent = () => {
    switch (pageState) {
      case 3:
        return (<LoginUI onLogIn={signIn}></LoginUI>)
      case 4:
        return "bookmark panel"
      case 5:
        return (<FilterPanelUI></FilterPanelUI>)
      case 6:
         return (<InfoPanelUI currentProperty={selectedSearch}></InfoPanelUI>)
    }

    return ''
  }

  

  return (
    <div className="property-web-app">
      <MapUI></MapUI>
      <div className="navbar-container">
        <SearchBarUI onChange={onSearchChange} selectedSearch={selectedSearch}></SearchBarUI>
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
      
    </div>
  );
}

export default App
