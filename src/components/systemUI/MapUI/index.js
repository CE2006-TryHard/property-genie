import React from 'react'
import "./MapUI.scss"
import {Loader} from "@googlemaps/js-api-loader"
import { dbMgr } from '../../systemMgr/Mgr'

const DISTRICT_MAP_CONFIG = {
  'ALJUNIED': {center: [1.3555715535760746, 103.90086214217095], zoom: 13.5},
  'ANG MO KIO': {center: [1.396758400085899, 103.86652986678033], zoom: 13.5},
  'BISHAN-TOA PAYOH': {center: [1.347334099518994, 103.8321975913897], zoom: 14},
  'BUKIT BATOK': {center: [1.3487070104674541, 103.74774019392876], zoom: 16},
  'BUKIT PANJANG': {center: [1.3755129413506444, 103.7742275449165], zoom: 15},
  'CHUA CHU KANG': {center: [1.398165617278094, 103.70499646915792], zoom: 13},
  'EAST COAST': {center: [1.3685798124450437, 103.99788515452033], zoom: 12.7},
  'HOLLAND-BUKIT TIMAH': {center: [1.3651475618222881, 103.78519670847541], zoom: 13},
  'HONG KAH NORTH': {center: [1.3644954305073551, 103.73126070174126], zoom: 14},
  'HOUGANG': {center: [1.3679276820620003, 103.89605562361626], zoom: 15},
  'JALAN BESAR': {center: [1.2985952654318802, 103.85760347517876], zoom: 13.5},
  'JURONG': {center: [1.329108636813906, 103.74305384043342], zoom: 14},
  'KEBUN BARU': {center: [1.3830295304090263, 103.82533113631158], zoom: 14},
  'MACPHERSON': {center: [1.3253674196507252, 103.88506929549126], zoom: 15},
  'MARINE PARADE': {center: [1.3287997263062794, 103.89605562361626], zoom: 13.5},
  'MARSILING-YEW TEE': {center: [1.428334494649892, 103.76421968611626], zoom: 13},
  'MARYMOUNT': {center: [1.3590038178384098, 103.84387056502251], zoom: 14.5},
  'MOUNTBATTEN': {center: [1.2985952654318802, 103.88232271346001], zoom: 14},
  'NEE SOON': {center: [1.423529464533991, 103.83151094588189], zoom: 13.3},
  'PASIR RIS-PUNGGOL': {center: [1.390580418610186, 103.92489473494439], zoom: 13.3},
  'PIONEER': {center: [1.3384101595292985, 103.70104829939751], zoom: 15},
  'POTONG PASIR': {center: [1.3363507841428572, 103.87133638533501], zoom: 14},
  'PUNGGOL WEST': {center: [1.404995683441592, 103.89536897810845], zoom: 15},
  'RADIN MAS': {center: [1.2773146325802782, 103.81983797224908], zoom: 14},
  'SEMBAWANG': {center: [1.4564780395997028,103.8102249351397], zoom: 13.3},
  'SENGKANG': {center: [1.3926397475690528, 103.89674226912408], zoom: 14},
  'TAMPINES': {center: [1.3610631740552916, 103.93931429060845], zoom: 13.4},
  'TANJONG PAGAR': {center: [1.2939272740258816, 103.82622377756721], zoom: 13},
  'WEST COAST': {center: [1.281433478590405, 103.70448152693658], zoom: 12},
  'YIO CHU KANG': {center: [1.382343084833783, 103.84043733748345], zoom: 14},
  'YUHUA': {center: [1.3411559906872688, 103.7388138023272], zoom: 15}
}

const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const MAP_CENTER = {lat:1.360514, lng: 103.840300}
const MAP_ZOOM = 11

const ICON_CONFIG = {
  path: "M0,5a5,5 0 1,0 10,0a5,5 0 1,0 -10,0",
  fillColor: "grey",
  fillOpacity: 0.6,
  strokeWeight: 1,
  strokeColor: '#555555',
  rotation: 0,
  scale: 1.5
}

const DISTRICT_POLYGON_CONFIG = {
  cursor: 'default',
  strokeWeight: 1,
  strokeColor: '#FFFFFF',
}
let googleRef = null

export default class MapUI extends React.Component {
  constructor(props) {
    super(props)
    this.map = null
    this.state = {
      showBubble: false,
      bubblePos: [0,0],
      currentHoverDistrict: null,
      currentZoomInDistrict: null,
      currentHoverProperty: null
      // isZoom: false
    }
    this.markers = {}
  }

  render() {
    const mapStyles = {
      width: '100%',
      height: '100%'
    }

    const {currentHoverDistrict, currentZoomInDistrict, currentHoverProperty} = this.state

    const [bubbleX, bubbleY] = this.state.bubblePos
    const bubbleStyle = {
      left: bubbleX + 10,
      top: bubbleY + 20
    }

    const showInfo = currentHoverProperty || (currentHoverDistrict && currentHoverDistrict !== currentZoomInDistrict)

    return (
      <div className="map-container">
        {showInfo ?
        <div className="info-bubble" style={bubbleStyle}>
          {currentHoverProperty ?
          <div>
            {currentHoverProperty.name}
          </div>
          : <div>{currentHoverDistrict.name}</div>
          }
          
        </div>
         : ""}
        <span>{this.props.filterOptions.enbloc.checked ? 'ha' : ''}</span>
        <div className="map-content"></div>
      </div>
    )
  }

  displayPropertiesInDistrict(district) {
    if (!district) {
      Object.keys(this.markers).forEach(dName => {
        Object.keys(this.markers[dName]).forEach(pName => {
          this.markers[dName][pName].setVisible(false)
        })
      })
      return
    }

    if (!this.markers[district.name]) this.markers[district.name] = {}
    district.properties.forEach(p => {
      // initialise marker if had not done so
      if (!this.markers[district.name][p.name]) {
        this.markers[district.name][p.name] = new googleRef.maps.Marker({
          position: {lat: p.lat, lng: p.lng},
          icon: ICON_CONFIG,
          map: this.map,
          // title: p.name,
          editable: false
        })

        googleRef.maps.event.addListener(this.markers[district.name][p.name], 'click', () => {
          this.props.onPropertySelect(p)
        })

        googleRef.maps.event.addListener(this.markers[district.name][p.name], 'mouseover', () => {
          this.setState({...this.state, currentHoverProperty: p})
        })

        googleRef.maps.event.addListener(this.markers[district.name][p.name], 'mouseout', () => {
          this.setState({...this.state, currentHoverProperty: null})
        })
      }
    })

    Object.keys(this.markers).forEach(dName => {
      Object.keys(this.markers[dName]).forEach(pName => {
        const newIconConfig = {
          ...ICON_CONFIG,
          fillColor: this.getPropertyColorHex(dbMgr.getPropertiesByName(pName))
        }
        this.markers[dName][pName].setIcon(newIconConfig)
        this.markers[dName][pName].setVisible(dName === district.name)
      })
    })
  }

  getDistrictColorHex(district) {
    const colorFrom = [181, 181, 181]
    const colorTo = [0, 181, 122]
    if (!district.properties.length) return '#333333'
    const districts = dbMgr.getDistricts()
    const avgDistrictVal = Object.keys(districts).reduce((acc, dName) => {
      return acc + districts[dName].getDistrictValue(this.props.filterOptions)
    }, 0) / 31

    if (avgDistrictVal === 0) return '#666666'

    let ratio = district.getDistrictValue(this.props.filterOptions) / avgDistrictVal
    ratio = Math.min(1, ratio)
    const r = colorFrom[0] - Math.round(ratio * colorFrom[0])
    const g = colorFrom[1]
    const b = colorFrom[2] - Math.round(ratio * (colorFrom[2]-colorTo[2]))
    return rgbToHex(r,g,b)
  }

  getPropertyColorHex(property) {
    const maxPropertyVal = Math.max(...property.district.properties.map(p => p.getPropertyValue(this.props.filterOptions)))
    const colorFrom = [255, 223, 122]
    const colorTo = [0, 223, 122]

    let ratio = property.getPropertyValue(this.props.filterOptions) / maxPropertyVal
    ratio = Math.min(1, ratio)

    const r = colorFrom[0] - Math.round(ratio * (colorFrom[0] - colorTo[0]))
    const g = colorFrom[1] + Math.round(ratio * (colorTo[1] - colorFrom[1]))
    const b = colorFrom[2] - Math.round(ratio * (colorFrom[2]-colorTo[2]))
    return rgbToHex(r,g,b)
  }

  componentDidMount() {
    const loader = new Loader({
      apiKey: 'AIzaSyAvXrCz1aaHL0MH8a6qQFW9zfwS8FP_mks'
    })

    loader.load().then(google => {
      googleRef = google
      this.map = new google.maps.Map(document.querySelector(".map-content"), {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        draggable: false,
        disableDoubleClickZoom: true
      })

      const districts = dbMgr.getDistricts()

      this.map.data.loadGeoJson('data/districts_simplify.geojson')

      this.map.data.setStyle(feature => {
        return {
          ...DISTRICT_POLYGON_CONFIG,
          fillColor: this.getDistrictColorHex(districts[feature.getProperty('Name')]),
          fillOpacity: 0.7
        }
      })

      this.map.data.addListener('mousemove', e => {
        const {clientX, clientY} = e.domEvent
        this.setState({...this.state, bubblePos: [clientX, clientY]})
      })

      this.map.data.addListener('mouseover', e => {
        const district = districts[e.feature.getProperty('Name')]
        this.setState({...this.state, currentHoverDistrict: district})
        
        // if (district === this.state.currentZoomInDistrict) return

        this.map.data.setStyle(f => {
          const tDistrict = districts[f.getProperty('Name')]
          const isTargetDistrict = this.state.currentZoomInDistrict && this.state.currentZoomInDistrict === tDistrict
          return {
            ...DISTRICT_POLYGON_CONFIG,
            fillColor: this.getDistrictColorHex(tDistrict),
            strokeWeight: isTargetDistrict? 2 : 1,
            strokeColor: isTargetDistrict || tDistrict === district ? '#333333' : '#FFFFFF',
            fillOpacity: isTargetDistrict ? 0 : 0.7,
            zIndex: isTargetDistrict || tDistrict === district ? 1 : 0
          }
        })
      })

      this.map.data.addListener('click', e => {
        const district = districts[e.feature.getProperty('Name')]
        this.props.onDistrictSelect(district)
      })

      this.map.data.addListener('mouseout', e => {
        this.setState({...this.state, currentHoverDistrict: null})
        
        if (districts[e.feature.getProperty('Name')] === this.state.currentZoomInDistrict) return

        this.map.data.setStyle(f => {
          const tDistrict = districts[f.getProperty('Name')]
          const isTargetDistrict = this.state.currentZoomInDistrict && this.state.currentZoomInDistrict === tDistrict

          return {
            ...DISTRICT_POLYGON_CONFIG,
            strokeColor: isTargetDistrict ? '#333333' : '#FFFFFF',
            strokeWeight: isTargetDistrict? 2 : 1,
            fillColor: this.getDistrictColorHex(tDistrict),
            fillOpacity: isTargetDistrict ? 0 : 0.7
          }
        })
      })
    })
  }

  componentDidUpdate(prevProps) {
    const {filterOptions, curDistrict} = prevProps
    const districts = dbMgr.getDistricts()

    if (filterOptions !== this.props.filterOptions) {
      const district = this.props.curDistrict
      const districts = dbMgr.getDistricts()
      this.displayPropertiesInDistrict(this.props.curDistrict)
  
      this.map.data.setStyle(feature => {
        const isTargetDistrict = district && feature.getProperty('Name') === district.name
        return {
          ...DISTRICT_POLYGON_CONFIG,
          strokeWeight: isTargetDistrict? 2 : 1,
          fillColor: this.getDistrictColorHex(districts[feature.getProperty('Name')]),
          fillOpacity: isTargetDistrict ? 0 : 0.7
        }
      })
    }

    if (curDistrict !== this.props.curDistrict) {
        const district = this.props.curDistrict
        this.setState({...this.state, currentZoomInDistrict: district})
        this.displayPropertiesInDistrict(district)

        this.map.data.setStyle(feature => {
          const isTargetDistrict = district && feature.getProperty('Name') === district.name
          return {
            ...DISTRICT_POLYGON_CONFIG,
            strokeColor: isTargetDistrict ? '#333333' : '#FFFFFF',
            strokeWeight: isTargetDistrict? 2 : 1,
            fillColor: this.getDistrictColorHex(districts[feature.getProperty('Name')]),
            fillOpacity: isTargetDistrict ? 0 : 0.7,
            zIndex: isTargetDistrict ? 1 : 0
          }
        })
  
        if (!this.props.curDistrict) {
          this.map.setCenter(MAP_CENTER)
          this.map.setZoom(MAP_ZOOM)
        } else {
          const {center, zoom} = DISTRICT_MAP_CONFIG[district.name]
          this.map.setCenter({lat: center[0], lng: center[1]})
          this.map.setZoom(zoom)
        }
    }
  }

  update
}
