import { useEffect, useState } from 'react'
import "./MapUI.scss"
import {Loader} from "@googlemaps/js-api-loader"
// import {MarkerClusterer} from '@googlemaps/markerclusterer'
import { dbMgr } from '../../controls/Mgr'
import { CONSTITUENCY_MAP_CONFIG, MAP_STYLES } from './MAP_CONFIG'

const MAP_CENTER = {lat:1.360514, lng: 103.840300}
const MAP_ZOOM = 11.5
const MAP_BOUND_RESTRICTION = {
  latLngBounds: {north: 1.56081, south: 1.1201,east: 104.21781,west: 103.46456},
  strictBounds: false
}

const ICON_CONFIG = {
  path: "M0,5a5,5 0 1,0 10,0a5,5 0 1,0 -10,0",
  fillColor: "red",
  fillOpacity: 0.8,
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
let markerInfoWindow = null

export {gService}

const markers = {}

/**
 * @namespace MapUI
 * @description boundary module
 * @property {Object} overlayPos
 * @property {Constituency} curHoverC
 * @property {Property} curHoverP
 */
const MapUI = props => {
    const {filterOptions, curConstituency, locatedProperty, triggerReset, onPropertySelect, onConstituencySelect} = props
    const [overlayPos, setOverlayPos] = useState({left: 0, top: 0})
    const [curHoverC, setCurHoverC] = useState(null)
    const [curHoverP, setCurHoverP] = useState(null)
    
    /**
     * @memberof MapUI
     * @typedef {function} rgbToHex convert rgb value to hex string
     * @param {number} r
     * @param {number} g
     * @param {number} b
     * @return {String} hex color code in string
     */
    const rgbToHex = (r, g, b) => {
      const componentToHex = c => {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    /**
     * @memberof MapUI
     * @typedef {function} getConstituencyColorHex convert constituency value into color form
     * @param {Constituency} c constituency
     * @return {String} hex color code in string
     */
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
      
    /**
     * @memberof MapUI
     * @typedef {function} getPropertyColorHex convert property value into color form
     * @param {Property} property
     * @return {String} hex color code in string
     */
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

    /**
     * @memberof MapUI
     * @typedef {function} updateMarkerAppearance update map display based on current selected constituency
     * @param {Constituency} c
     */
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
            setCurHoverP(p)
          })
  
          googleRef.maps.event.addListener(markers[c.name][p.name], 'mouseout', () => {
            setCurHoverP(null)
          })
        }
      })

      Object.keys(markers).forEach(cName => {
        Object.keys(markers[cName]).forEach(pName => {
          markers[cName][pName].setVisible(false)
          if (cName === c.name) {
            const newIconConfig = {
              ...ICON_CONFIG,
                fillOpacity: 0.4,
                strokeColor: '#aaaaaa',
                strokeWeight: 1,
                fillColor: '#cccccc'
            }
            markers[cName][pName].setZIndex(0)
            markers[cName][pName].setIcon(newIconConfig)
          }
        })
      })

      c.getProperties().forEach(p => {
        markers[c.name][p.name].setVisible(true)
      })

      c.getFilteredProperties(filterOptions).forEach(p => {
        const newIconConfig = {
          ...ICON_CONFIG,
          fillColor: getPropertyColorHex(p),
        }
        markers[c.name][p.name].setZIndex(1)
        markers[c.name][p.name].setIcon(newIconConfig)
      })
    }

    /**
     * @memberof MapUI
     * @typedef {function} updateMouseOverPolygonEvent update mouseover event listener of polygon object
     */
    const updateMouseOverPolygonEvent = () => {
      const constituencies = dbMgr.getConstituencies()
      mapRef.data.addListener('mouseover', e => {
        const c = constituencies[e.feature.getProperty('Name')]
        setCurHoverC(c)

        mapRef.data.setStyle(f => {
          const tConstituency = constituencies[f.getProperty('Name')]
          const isTargetConstituency = curConstituency && curConstituency === tConstituency
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
    }

    /**
     * @memberof MapUI
     * @typedef {function} updateMouseOutPolygonEvent update mouseout event listener of polygon object
     */
    const updateMouseOutPolygonEvent = () => {
      const constituencies = dbMgr.getConstituencies()
      mapRef.data.addListener('mouseout', e => {
        setCurHoverC(null)
        
        mapRef.data.setStyle(f => {
          const isTargetConstituency = curConstituency && f.getProperty('Name') === curConstituency.name
          return {
            ...CONSTITUENCY_POLYGON_CONFIG,
            strokeColor: isTargetConstituency ? '#333333' : '#FFFFFF',
            strokeWeight: isTargetConstituency? 2 : 1,
            fillColor: getConstituencyColorHex(constituencies[f.getProperty('Name')]),
            fillOpacity: isTargetConstituency ? 0 : 0.7,
            zIndex: isTargetConstituency ? 1 : 0
          }
        })
      })
    }

    /**
     * @memberof MapUI
     * @typedef {function} setMapZoom set map zoom level
     * @param {Constituency} c
     * @param {Object} mapRef reference to Google Map object
     * @return {String} hex color code in string
     */
    const setMapZoom = (c, mapRef) => {
      if (c) {
        const {center, zoom} = CONSTITUENCY_MAP_CONFIG[c.name]
        mapRef.setCenter({lat: center[0], lng: center[1]})
        mapRef.setZoom(zoom)
        mapRef.setOptions({minZoom: 12})
      } else {
        mapRef.setOptions({minZoom: MAP_ZOOM})
        mapRef.setCenter(MAP_CENTER)
        mapRef.setZoom(MAP_ZOOM)
      }
      
    }

    /**
     * @memberof MapUI
     * @typedef {function} useEffect1 load Google API and setup the map when component is firstly mounted
     * @param {function} callback
     * @param {Array} watchList []
     */
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
          maxZoom: 17,
          minZoom: MAP_ZOOM,
          restriction: MAP_BOUND_RESTRICTION,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          disableDoubleClickZoom: true,
          styles: MAP_STYLES
        })

        markerInfoWindow = new google.maps.InfoWindow({
          content: 'check'
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

        // mapRef.addListener('click', e => {
        //   const {lat, lng} = e.latLng.toJSON()
        //   console.log(lat, lng)
        // })
  
        mapRef.data.addListener('click', e => {
          const c = constituencies[e.feature.getProperty('Name')]
          onConstituencySelect(c)
        })

        updateMouseOverPolygonEvent()
        updateMouseOutPolygonEvent()

        
      })
    }, [])

    /**
     * @memberof MapUI
     * @typedef {function} useEffect2 update map display when current selected constituency/fitler options are changed
     * @param {function} callback
     * @param {Array} watchList [curConstituency, filterOptions]
     */
    useEffect(() => {
      if (!mapRef) return
      const constituencies = dbMgr.getConstituencies()
      updateMarkerAppearance(curConstituency)
      updateMouseOverPolygonEvent()
      updateMouseOutPolygonEvent()
  
      mapRef.data.setStyle(f => {
        const isTargetConstituency = curConstituency && f.getProperty('Name') === curConstituency.name
        return {
          ...CONSTITUENCY_POLYGON_CONFIG,
          strokeColor: isTargetConstituency ? '#333333' : '#FFFFFF',
          strokeWeight: isTargetConstituency? 2 : 1,
          fillColor: getConstituencyColorHex(constituencies[f.getProperty('Name')]),
          fillOpacity: isTargetConstituency ? 0 : 0.7,
          zIndex: isTargetConstituency ? 1 : 0
        }
      })

    }, [curConstituency, filterOptions])

    /**
     * @memberof MapUI
     * @typedef {function} useEffect3 performs a zoom whenever a different constituency is searched/selected on map
     * @param {function} callback
     * @param {Array} watchList [curConstituency]
     */
     useEffect(() => {
      if (!mapRef) return
      setMapZoom(curConstituency, mapRef)
  
    }, [curConstituency])


    /**
     * @memberof MapUI
     * @typedef {function} useEffect4 update map display when current located property changed
     * @param {function} callback
     * @param {Array} watchList [locatedProperty]
     */
    useEffect(() => {
      if (locatedProperty) {
        if (curConstituency) {
          const {lat, lng} = locatedProperty
          mapRef.setCenter({lat: lat, lng: lng})
          markerInfoWindow.open(mapRef, markers[curConstituency.name][locatedProperty.name])
          markerInfoWindow.setContent(locatedProperty.name)
        }
      } else {
        if (markerInfoWindow) {
          markerInfoWindow.close()
        }
      }
    }, [locatedProperty])
    
    /**
     * @memberof MapUI
     * @typedef {function} useEffect5 reset map display when triggerReset changed
     * @param {function} callback
     * @param {Array} watchList [triggerReset]
     */
    useEffect(() => {
      if (!mapRef) return
        setMapZoom(null, mapRef)
    }, [triggerReset])


    const noOfFilteredPropertyInHoverC = curHoverC && curHoverC.getFilteredProperties(filterOptions).length
    const totalNoOfPropertyInHoverC = curHoverC && curHoverC.getProperties().length
    const cHoverTextTotal = totalNoOfPropertyInHoverC > 1 ? 'properties' : 'property'
    return (
      <div className="map-container">
        {(curHoverP || curHoverC) ?
        <div className="info-bubble" style={overlayPos}>
          {curHoverP ?
          <div>
            {curHoverP.name}<br />
            Score: <b>{(curHoverP.getPropertyValue(filterOptions) * 100).toFixed(0)}%</b>
          </div>
          : <div>
              {curHoverC.name}<br />
              <b>{noOfFilteredPropertyInHoverC}/{totalNoOfPropertyInHoverC}</b> {cHoverTextTotal}
            </div>
          }
          
        </div>
         : ""}
        <div className="map-content"></div>
      </div>
    )
  }

  export default MapUI
  