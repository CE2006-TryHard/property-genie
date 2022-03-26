import React from 'react'
import "./MapUI.scss"
import {Loader} from "@googlemaps/js-api-loader"
import { dbMgr } from '../../controls/Mgr'
import { CONSTITUENCY_MAP_CONFIG, MAP_STYLES } from './MAP_CONFIG'

const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const MAP_CENTER = {lat:1.360514, lng: 103.840300}
const MAP_ZOOM = 11.5
const MAP_BOUND_RESTRICTION = {
  latLngBounds: {north: 1.56081, south: 1.1201,east: 104.21781,west: 103.46456},
  strictBounds: false
}
const ICON_CONFIG = {
  path: "M0,5a5,5 0 1,0 10,0a5,5 0 1,0 -10,0",
  fillColor: "red",
  fillOpacity: 0.6,
  strokeWeight: 1,
  strokeColor: '#555555',
  rotation: 0,
  scale: 1.5
}

const CONSTITUENCY_POLYGON_CONFIG = {
  cursor: 'default',
  strokeWeight: 1,
  strokeColor: '#FFFFFF',
}

let googleRef = null
let mapRef = null
let gService = null
export {mapRef, googleRef, gService}

export default class MapUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      overlayPos: [0,0],
      curHoverConstituency: null,
      curZoomInConstituency: null,
      currentHoverProperty: null
    }
    this.markers = {}
  }

  render() {
    const mapStyles = {
      width: '100%',
      height: '100%'
    }

    const {curHoverConstituency, currentHoverProperty} = this.state

    const [bubbleX, bubbleY] = this.state.overlayPos
    const bubbleStyle = {
      left: bubbleX + 10,
      top: bubbleY + 20
    }

    const showInfo = currentHoverProperty || curHoverConstituency
    return (
      <div className="map-container">
        {showInfo ?
        <div className="info-bubble" style={bubbleStyle}>
          {currentHoverProperty ?
          <div>
            {currentHoverProperty.name}
          </div>
          : <div>{curHoverConstituency.name}</div>
          }
          
        </div>
         : ""}
        <span>{this.props.filterOptions.enbloc.checked ? 'ha' : ''}</span>
        <div className="map-content"></div>
      </div>
    )
  }

  updateMarkerAppearance(c) {
    if (!c) {
      Object.keys(this.markers).forEach(dName => {
        Object.keys(this.markers[dName]).forEach(pName => {
          this.markers[dName][pName].setVisible(false)
        })
      })
      return
    }

    if (!this.markers[c.name]) this.markers[c.name] = {}
    c.properties.forEach(p => {
      // initialise marker if had not done so
      if (!this.markers[c.name][p.name]) {
        this.markers[c.name][p.name] = new googleRef.maps.Marker({
          position: {lat: p.lat, lng: p.lng},
          icon: ICON_CONFIG,
          map: mapRef,
          editable: false
        })

        googleRef.maps.event.addListener(this.markers[c.name][p.name], 'click', () => {
          this.props.onPropertySelect(p)
        })

        googleRef.maps.event.addListener(this.markers[c.name][p.name], 'mouseover', () => {
          this.setState({...this.state, currentHoverProperty: p})
        })

        googleRef.maps.event.addListener(this.markers[c.name][p.name], 'mouseout', () => {
          this.setState({...this.state, currentHoverProperty: null})
        })
      }
    })

    Object.keys(this.markers).forEach(dName => {
      Object.keys(this.markers[dName]).forEach(pName => {
        const newIconConfig = {
          ...ICON_CONFIG,
          fillColor: this.getPropertyColorHex(dbMgr.getPropertyByName(pName))
        }
        this.markers[dName][pName].setIcon(newIconConfig)
        this.markers[dName][pName].setVisible(dName === c.name)
      })
    })
  }

  getConstituencyColorHex(c) {
    const colorFrom = [181, 181, 181]
    const colorTo = [0, 181, 122]
    if (!c.properties.length) return '#222222'
    const constituencies = dbMgr.getConstituencies()
    const avgConstituencyVal = Object.keys(constituencies).reduce((acc, dName) => {
      return acc + constituencies[dName].getConstituencyValue(this.props.filterOptions)
    }, 0) / 31

    let [r,g,b] = colorFrom
    
    if (avgConstituencyVal > 0) {
      let ratio = c.getConstituencyValue(this.props.filterOptions) / avgConstituencyVal
      ratio = Math.min(1, ratio)
      r -= Math.round(ratio * colorFrom[0])
      g = colorFrom[1]
      b -= Math.round(ratio * (colorFrom[2]-colorTo[2]))
    }
    
    return rgbToHex(r,g,b)
  }

  getPropertyColorHex(property) {
    const maxPropertyVal = Math.max(...property.constituency.properties.map(p => p.getPropertyValue(this.props.filterOptions)))
    const colorFrom = [255, 223, 122]
    const colorTo = [0, 223, 122]

    let [r, g, b] = colorFrom
    
    if (maxPropertyVal > 0) {
      let ratio = property.getPropertyValue(this.props.filterOptions) / maxPropertyVal
      ratio = Math.min(1, ratio)

      r -= Math.round(ratio * (colorFrom[0] - colorTo[0]))
      g = 223
      b = 122
    }
    
    return rgbToHex(r,g,b)
  }

  componentDidMount() {
    const loader = new Loader({
      apiKey: 'AIzaSyAvXrCz1aaHL0MH8a6qQFW9zfwS8FP_mks',
      libraries: ['places']
    })

    loader.load().then(google => {
      googleRef = google
      mapRef = new google.maps.Map(document.querySelector(".map-content"), {
        center: MAP_CENTER,
        zoom: MAP_ZOOM,
        maxZoom: 16,
        minZoom: MAP_ZOOM,
        restriction: MAP_BOUND_RESTRICTION,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        // zoomControl: false,
        // draggable: false,
        disableDoubleClickZoom: true,
        styles: MAP_STYLES
      })

      gService = new google.maps.places.PlacesService(mapRef)
      const constituencies = dbMgr.getConstituencies()

      mapRef.data.loadGeoJson('data/constituencies.geojson')

      mapRef.data.setStyle(feature => {
        return {
          ...CONSTITUENCY_POLYGON_CONFIG,
          fillColor: this.getConstituencyColorHex(constituencies[feature.getProperty('Name')]),
          fillOpacity: 0.7
        }
      })

      mapRef.data.addListener('mousemove', e => {
        const {clientX, clientY} = e.domEvent
        this.setState({...this.state, overlayPos: [clientX, clientY]})
      })

      mapRef.data.addListener('mouseover', e => {
        const c = constituencies[e.feature.getProperty('Name')]
        this.setState({...this.state, curHoverConstituency: c})
        
        // if (c === this.state.curZoomInConstituency) return

        mapRef.data.setStyle(f => {
          const tConstituency = constituencies[f.getProperty('Name')]
          const isTargetConstituency = this.state.curZoomInConstituency && this.state.curZoomInConstituency === tConstituency
          return {
            ...CONSTITUENCY_POLYGON_CONFIG,
            fillColor: this.getConstituencyColorHex(tConstituency),
            strokeWeight: isTargetConstituency? 2 : 1,
            strokeColor: isTargetConstituency || tConstituency === c ? '#333333' : '#FFFFFF',
            fillOpacity: isTargetConstituency ? 0 : 0.7,
            zIndex: isTargetConstituency || tConstituency === c ? 1 : 0
          }
        })
      })
      // mapRef.addListener('click', e => {
      //   const {lat, lng} = e.latLng.toJSON()
      //   console.log(lat, lng)
      // })

      mapRef.data.addListener('click', e => {
        
        const c = constituencies[e.feature.getProperty('Name')]
        this.props.onConstituencySelect(c)
      })

      mapRef.data.addListener('mouseout', e => {
        this.setState({...this.state, curHoverConstituency: null})
        
        if (constituencies[e.feature.getProperty('Name')] === this.state.curZoomInConstituency) return

        mapRef.data.setStyle(f => {
          const tConstituency = constituencies[f.getProperty('Name')]
          const isTargetConstituency = this.state.curZoomInConstituency && this.state.curZoomInConstituency === tConstituency

          return {
            ...CONSTITUENCY_POLYGON_CONFIG,
            strokeColor: isTargetConstituency ? '#333333' : '#FFFFFF',
            strokeWeight: isTargetConstituency? 2 : 1,
            fillColor: this.getConstituencyColorHex(tConstituency),
            fillOpacity: isTargetConstituency ? 0 : 0.7,
            zIndex: isTargetConstituency ? 1 : 0
          }
        })
      })
    })
  }

  componentDidUpdate(prevProps) {
    const {filterOptions, curConstituency, triggerReset} = prevProps
    const constituencies = dbMgr.getConstituencies()
    const curC = this.props.curConstituency

    if (filterOptions !== this.props.filterOptions) {
      
      this.updateMarkerAppearance(this.props.curConstituency)
  
      mapRef.data.setStyle(feature => {
        const isTargetConstituency = curC && feature.getProperty('Name') === curC.name
        return {
          ...CONSTITUENCY_POLYGON_CONFIG,
          strokeWeight: isTargetConstituency? 2 : 1,
          fillColor: this.getConstituencyColorHex(constituencies[feature.getProperty('Name')]),
          fillOpacity: isTargetConstituency ? 0 : 0.7
        }
      })
    }

    if (curConstituency !== this.props.curConstituency) {
        this.setState({...this.state, curZoomInConstituency: curC})
        this.updateMarkerAppearance(curC)

        mapRef.data.setStyle(feature => {
          const isTargetConstituency = curC && feature.getProperty('Name') === curC.name
          return {
            ...CONSTITUENCY_POLYGON_CONFIG,
            strokeColor: isTargetConstituency ? '#333333' : '#FFFFFF',
            strokeWeight: isTargetConstituency? 2 : 1,
            fillColor: this.getConstituencyColorHex(constituencies[feature.getProperty('Name')]),
            fillOpacity: isTargetConstituency ? 0 : 0.7,
            zIndex: isTargetConstituency ? 1 : 0
          }
        })
        
        if (!this.props.curConstituency) {
          mapRef.setOptions({minZoom: MAP_ZOOM})
          mapRef.setCenter(MAP_CENTER)
          mapRef.setZoom(MAP_ZOOM)
        } else {
          const {center, zoom} = CONSTITUENCY_MAP_CONFIG[curC.name]
          mapRef.setCenter({lat: center[0], lng: center[1]})
          mapRef.setZoom(zoom)
          mapRef.setOptions({minZoom: 12})
        }
    }

    if (triggerReset !== this.props.triggerReset) {
        mapRef.setOptions({minZoom: MAP_ZOOM})
          mapRef.setCenter(MAP_CENTER)
          mapRef.setZoom(MAP_ZOOM)
    }
  }
}
