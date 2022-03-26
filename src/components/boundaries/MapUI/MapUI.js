import { useEffect, useState } from 'react'
import "./MapUI.scss"
import {Loader} from "@googlemaps/js-api-loader"
import { dbMgr } from '../../controls/Mgr'
import { CONSTITUENCY_MAP_CONFIG, MAP_STYLES } from './MAP_CONFIG'

const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
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

const markers = {}
const MapUI = props => {
    const {filterOptions, curConstituency, triggerReset, onPropertySelect, onConstituencySelect} = props
    const [overlayPos, setOverlayPos] = useState({left: 0, top: 0})
    const [curHoverConstituency, setCurHoverConstituency] = useState(null)
    const [curZoomInConstituency, setCurZoomInConstituency] = useState(null)
    const [currentHoverProperty, setCurrentHoverProperty] = useState(null)
  
    const getConstituencyColorHex = c => {
        const colorFrom = [181, 181, 181]
        const colorTo = [0, 181, 122]
        if (!c.properties.length) return '#222222'
        const constituencies = dbMgr.getConstituencies()
        const avgConstituencyVal = Object.keys(constituencies).reduce((acc, dName) => {
          return acc + constituencies[dName].getConstituencyValue(filterOptions)
        }, 0) / 31
    
        let [r,g,b] = colorFrom
        
        if (avgConstituencyVal > 0) {
          let ratio = c.getConstituencyValue(filterOptions) / avgConstituencyVal
          ratio = Math.min(1, ratio)
          r -= Math.round(ratio * colorFrom[0])
          g = colorFrom[1]
          b -= Math.round(ratio * (colorFrom[2]-colorTo[2]))
        }
        
        return rgbToHex(r,g,b)
      }
    
      const getPropertyColorHex = property => {
        const maxPropertyVal = Math.max(...property.constituency.properties.map(p => p.getPropertyValue(filterOptions)))
        const colorFrom = [255, 223, 122]
        const colorTo = [0, 223, 122]
    
        let [r, g, b] = colorFrom
        
        if (maxPropertyVal > 0) {
          let ratio = property.getPropertyValue(filterOptions) / maxPropertyVal
          ratio = Math.min(1, ratio)
    
          r -= Math.round(ratio * (colorFrom[0] - colorTo[0]))
          g = 223
          b = 122
        }
        
        return rgbToHex(r,g,b)
    }

    const updateMarkerAppearance = c => {
      if (!c) {
        Object.keys(markers).forEach(dName => {
          Object.keys(markers[dName]).forEach(pName => {
            markers[dName][pName].setVisible(false)
          })
        })
        return
      }
  
      if (!markers[c.name]) markers[c.name] = {}
      c.properties.forEach(p => {
        // initialise marker if had not done so
        if (!markers[c.name][p.name]) {
          markers[c.name][p.name] = new googleRef.maps.Marker({
            position: {lat: p.lat, lng: p.lng},
            icon: ICON_CONFIG,
            map: mapRef,
            editable: false
          })
  
          googleRef.maps.event.addListener(markers[c.name][p.name], 'click', () => {
            onPropertySelect(p)
          })
  
          googleRef.maps.event.addListener(markers[c.name][p.name], 'mouseover', () => {
            setCurrentHoverProperty(p)
          })
  
          googleRef.maps.event.addListener(markers[c.name][p.name], 'mouseout', () => {
            setCurrentHoverProperty(null)
          })
        }
      })
  
      Object.keys(markers).forEach(dName => {
        Object.keys(markers[dName]).forEach(pName => {
          const newIconConfig = {
            ...ICON_CONFIG,
            fillColor: getPropertyColorHex(dbMgr.getPropertyByName(pName))
          }
          markers[dName][pName].setIcon(newIconConfig)
          markers[dName][pName].setVisible(dName === c.name)
        })
      })
    }

    useEffect(() => { // componentDidMount
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
          disableDoubleClickZoom: true,
          styles: MAP_STYLES
        })
  
        gService = new google.maps.places.PlacesService(mapRef)
        const constituencies = dbMgr.getConstituencies()
  
        mapRef.data.loadGeoJson('data/constituencies.geojson')
  
        mapRef.data.setStyle(feature => {
          return {
            ...CONSTITUENCY_POLYGON_CONFIG,
            fillColor: getConstituencyColorHex(constituencies[feature.getProperty('Name')]),
            fillOpacity: 0.7
          }
        })
  
        mapRef.data.addListener('mousemove', e => {
          const {clientX, clientY} = e.domEvent
          setOverlayPos({left: clientX + 10, top: clientY + 10})
        })
  
        mapRef.data.addListener('mouseover', e => {
          const c = constituencies[e.feature.getProperty('Name')]
          setCurHoverConstituency(c)

          mapRef.data.setStyle(f => {
            const tConstituency = constituencies[f.getProperty('Name')]
            const isTargetConstituency = curZoomInConstituency && curZoomInConstituency === tConstituency
            return {
              ...CONSTITUENCY_POLYGON_CONFIG,
              fillColor: getConstituencyColorHex(tConstituency),
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
          onConstituencySelect(c)
        })
  
        mapRef.data.addListener('mouseout', e => {
          setCurHoverConstituency(null)
          
          if (constituencies[e.feature.getProperty('Name')] === curZoomInConstituency) return
  
          mapRef.data.setStyle(f => {
            const tConstituency = constituencies[f.getProperty('Name')]
            const isTargetConstituency = curZoomInConstituency && curZoomInConstituency === tConstituency
  
            return {
              ...CONSTITUENCY_POLYGON_CONFIG,
              strokeColor: isTargetConstituency ? '#333333' : '#FFFFFF',
              strokeWeight: isTargetConstituency? 2 : 1,
              fillColor: getConstituencyColorHex(tConstituency),
              fillOpacity: isTargetConstituency ? 0 : 0.7,
              zIndex: isTargetConstituency ? 1 : 0
            }
          })
        })
      })
    }, [])

    useEffect(() => {
      if (!mapRef) return
      const constituencies = dbMgr.getConstituencies()
      updateMarkerAppearance(curConstituency)
      mapRef.data.setStyle(feature => {
        const isTargetConstituency = curConstituency && feature.getProperty('Name') === curConstituency.name
        return {
          ...CONSTITUENCY_POLYGON_CONFIG,
          strokeWeight: isTargetConstituency? 2 : 1,
          fillColor: getConstituencyColorHex(constituencies[feature.getProperty('Name')]),
          fillOpacity: isTargetConstituency ? 0 : 0.7
        }
      })
  
    }, [filterOptions])
  
    useEffect(() => {
      if (!mapRef) return
      const constituencies = dbMgr.getConstituencies()
      setCurZoomInConstituency(curConstituency)
      updateMarkerAppearance(curConstituency)
  
      mapRef.data.setStyle(feature => {
        const isTargetConstituency = curConstituency && feature.getProperty('Name') === curConstituency.name
        return {
          ...CONSTITUENCY_POLYGON_CONFIG,
          strokeColor: isTargetConstituency ? '#333333' : '#FFFFFF',
          strokeWeight: isTargetConstituency? 2 : 1,
          fillColor: getConstituencyColorHex(constituencies[feature.getProperty('Name')]),
          fillOpacity: isTargetConstituency ? 0 : 0.7,
          zIndex: isTargetConstituency ? 1 : 0
        }
      })
      
      if (!curConstituency) {
        mapRef.setOptions({minZoom: MAP_ZOOM})
        mapRef.setCenter(MAP_CENTER)
        mapRef.setZoom(MAP_ZOOM)
      } else {
        const {center, zoom} = CONSTITUENCY_MAP_CONFIG[curConstituency.name]
        mapRef.setCenter({lat: center[0], lng: center[1]})
        mapRef.setZoom(zoom)
        mapRef.setOptions({minZoom: 12})
      }
    }, [curConstituency])
  
    useEffect(() => {
      if (!mapRef) return
        mapRef.setOptions({minZoom: MAP_ZOOM})
        mapRef.setCenter(MAP_CENTER)
        mapRef.setZoom(MAP_ZOOM)
    }, [triggerReset])
  
    return (
      <div className="map-container">
        {(currentHoverProperty || curHoverConstituency) ?
        <div className="info-bubble" style={overlayPos}>
          {currentHoverProperty ?
          <div>
            {currentHoverProperty.name}
          </div>
          : <div>{curHoverConstituency.name}</div>
          }
          
        </div>
         : ""}
        <div className="map-content"></div>
      </div>
    )
  }

  export default MapUI
  