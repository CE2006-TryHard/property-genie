import './styles/App.scss'
import FilterMgr from './components/systemMgr/FilterMgr'
import MapUI from './components/systemUI/MapUI'
import SidePanelUI from './components/systemUI/SidePanelUI/index'
import SearchBarUI from './components/systemUI/SearchBarUI'
import SidePanelOptMgr from './components/systemMgr/SidePanelOptMgr'
import LightBoxWrapper from './components/systemUI/LightboxWrapper/index'
import {useState} from 'react'

// page state
// HOME         1
// ZOOM IN      2
// LOGIN        3
// BOOKMARK     4
// FILTER       5
// INFORMATION  6

function App() {
  const filterMgr = new FilterMgr()
  const sidePanelOptMgr = new SidePanelOptMgr()
  const [pageState, setPageState] = useState(0)
  const [showLightBox, setShowLightbox] = useState(false)
  
  const onSidePanelOptSelect = (newState) => {
    setPageState(newState)
    if (newState > 0) {
      setShowLightbox(true)
    }
  }

  const onLightboxClose = () => {
    setPageState(0)
    setShowLightbox(false)
  }

  return (
    <div className="property-web-app">
      <MapUI></MapUI>
      <SearchBarUI></SearchBarUI>
      <SidePanelUI sidePanelOptMgr={sidePanelOptMgr} onOptionSelect={onSidePanelOptSelect}></SidePanelUI>
      <LightBoxWrapper isOpen={showLightBox} onClose={onLightboxClose}>{"page state" + pageState}</LightBoxWrapper>
      
    </div>
  );
}

export default App;
