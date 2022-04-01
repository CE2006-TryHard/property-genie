import { useEffect, useState } from 'react'
import "./MapUI.scss"
import {Loader} from "@googlemaps/js-api-loader"
// import {MarkerClusterer} from '@googlemaps/markerclusterer'
import { dbMgr } from '../../controls/Mgr'
import { CONSTITUENCY_MAP_CONFIG, MAP_STYLES, MARKER_COLOR_SCHEME } from './MAP_CONFIG'
import { map } from '@firebase/util'

const MAP_CENTER = {lat:1.360514, lng: 103.840300}
const MAP_ZOOM = 11.5
const MAP_BOUND_RESTRICTION = {
  latLngBounds: {north: 1.56081, south: 1.1201,east: 104.21781,west: 103.46456},
  strictBounds: false
}

let marker_image = {}
const MARKER_OPACITY_0 = 0.2
const MARKER_OPACITY_1 = 0.7

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
    const {filterOptions, curConstituency, locatedProperty, onRemoveLocatedProperty, triggerReset, onPropertySelect, onConstituencySelect} = props
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
     * @typedef {function} showMarkerFromConstituency update map display based on current selected constituency
     * @param {Constituency} c
     */
    const showMarkerFromConstituency = c => {
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
            icon: marker_image[99],
            position: {lat: p.lat, lng: p.lng},
            opacity: 0.6,
            map: mapRef,
            editable: false
          })
  
          googleRef.maps.event.addListener(markers[c.name][p.name], 'click', () => onPropertySelect(p))
          googleRef.maps.event.addListener(markers[c.name][p.name], 'mouseover', () => setCurHoverP(p))
          googleRef.maps.event.addListener(markers[c.name][p.name], 'mouseout', () => setCurHoverP(null))
        }
      })

      Object.keys(markers).forEach(cName => {
        Object.keys(markers[cName]).forEach(pName => {
          markers[cName][pName].setVisible(false)
          if (cName === c.name) {
            markers[cName][pName].setZIndex(0)
            markers[cName][pName].setOpacity(MARKER_OPACITY_0)
            markers[cName][pName].setIcon(marker_image[99])
          }
        })
      })

      c.getFilteredProperties(filterOptions).forEach(p => {
        markers[c.name][p.name].setZIndex(1)
        const val = Math.floor(p.getPropertyValue(filterOptions) * 10)
        markers[c.name][p.name].setOpacity(MARKER_OPACITY_1)
        markers[c.name][p.name].setZIndex(1)
        markers[c.name][p.name].setIcon(marker_image[val])
      })

      c.getProperties().forEach(p => {
        markers[c.name][p.name].setVisible(true)
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

    const registerPolygonMouseOverEvent = () => {
      const constituencies = dbMgr.getConstituencies()
      mapRef.data.addListener('mouseover', e => {
        const c = constituencies[e.feature.getProperty('Name')]
        if (!c.mapFeature) c.mapFeature = e.feature
        setCurHoverC(c)
      })
    }

    const registerPolygonMouseOutEvent = () => {
      // initialise polygon mouse out event
      mapRef.data.addListener('mouseout', () => setCurHoverC(null))
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
        marker_image = [0,1,2,3,4,5,6,7,8,9,10,99].reduce((acc, index) => {
          acc[index] = new google.maps.MarkerImage(`images/circles/${index}.png`, null, null, null, new google.maps.Size(16,16))
          return acc
        }, {})
        
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

        console.log('google map api loaded')

        markerInfoWindow = new google.maps.InfoWindow({content: 'dummy'})
        googleRef.maps.event.addListener(markerInfoWindow, 'closeclick', () => {
          onRemoveLocatedProperty()
        })
        gService = new google.maps.places.PlacesService(mapRef)

        mapRef.data.loadGeoJson('data/constituencies.geojson')
        
        const constituencies = dbMgr.getConstituencies()
        mapRef.data.setStyle(feature => {
          return {
            ...CONSTITUENCY_POLYGON_CONFIG,
            fillColor: getConstituencyColorHex(constituencies[feature.getProperty('Name')]),
            fillOpacity: 0.7
          }
        })
        
        // initialise mouse cursor move event
        // keep track on mouse cursor position
        document.addEventListener('mousemove', e => {
          const {clientX, clientY} = e
          setOverlayPos({left: clientX + 10, top: clientY + 10})
        })

        // mapRef.addListener('click', e => {
        //   const {lat, lng} = e.latLng.toJSON()
        //   console.log(lat, lng)
        // })
        
        // intialise polygon click event
        mapRef.data.addListener('click', e => {
          const c = constituencies[e.feature.getProperty('Name')]
          onConstituencySelect(c)
        })

        registerPolygonMouseOverEvent()
        registerPolygonMouseOutEvent()
        
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
      showMarkerFromConstituency(curConstituency)
      
      mapRef.data.revertStyle()
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
      if (mapRef) setMapZoom(curConstituency, mapRef)
    }, [curConstituency])

    /**
     * @memberof MapUI
     * @typedef {function} useEffect4 average number of properties value in Database Control Class instance
     * @param {function} callback
     * @param {Array} watchList [filterOptions]
     */
    useEffect(() => {
      const constituencies = dbMgr.getConstituencies()
      const avgPropertiesCount = Object.keys(constituencies).reduce((acc, cName) => {
            return acc + constituencies[cName].getFilteredProperties(filterOptions).length
        }, 0) / 31
      dbMgr.setAvgPropertiesCount(avgPropertiesCount)
    }, [filterOptions])

    /**
     * @memberof MapUI
     * @typedef {function} useEffect5 update map display when current located property changed
     * @param {function} callback
     * @param {Array} watchList [locatedProperty]
     */
    useEffect(() => {
      if (locatedProperty) {
        if (curConstituency) {
          curConstituency.getProperties().forEach(p => {
            markers[curConstituency.name][p.name].setOpacity(MARKER_OPACITY_0)
            markers[curConstituency.name][p.name].setZIndex(0)
          })
  
          const {lat, lng} = locatedProperty
          mapRef.setCenter({lat: lat, lng: lng})
          markerInfoWindow.open(mapRef, markers[curConstituency.name][locatedProperty.name])
          markerInfoWindow.setContent(locatedProperty.name)

          markers[curConstituency.name][locatedProperty.name].setOpacity(1)
          markers[curConstituency.name][locatedProperty.name].setZIndex(1)
        }
      } else {
        if (markerInfoWindow) markerInfoWindow.close()
        
        if (curConstituency) showMarkerFromConstituency(curConstituency)
        
      }
    }, [locatedProperty])
    
    /**
     * @memberof MapUI
     * @typedef {function} useEffect6 reset map display when triggerReset changed
     * @param {function} callback
     * @param {Array} watchList [triggerReset]
     */
    useEffect(() => {
      if (!mapRef) return
        setMapZoom(null, mapRef)
    }, [triggerReset])

    // /**
    //  * @memberof MapUI
    //  * @typedef {function} useEffect7 update map display when hover on a marker
    //  * @param {function} callback
    //  * @param {Array} watchList [curHoverP]
    //  */
    // useEffect(() => {
    //   if (!curConstituency) return

    //   curConstituency.getProperties().forEach(p => {
    //     markers[curConstituency.name][p.name].setZIndex(0)
    //   })

    //   if (curHoverP) {
    //     markers[curConstituency.name][curHoverP.name].setOpacity(1)
    //     markers[curConstituency.name][curHoverP.name].setZIndex(1)
    //   } else {
    //     curConstituency.getProperties().forEach(p => {
    //       markers[curConstituency.name][p.name].setOpacity(MARKER_OPACITY_0)
    //     })  
    //     curConstituency.getFilteredProperties(filterOptions).forEach(p => {
    //       markers[curConstituency.name][p.name].setOpacity(MARKER_OPACITY_1)
    //       markers[curConstituency.name][p.name].setZIndex(1)
    //     })
    //   }
    // }, [curHoverP])

    /**
     * @memberof MapUI
     * @typedef {function} useEffect8 update map display when hover on a constituency polygon
     * @param {function} callback
     * @param {Array} watchList [curHoverC]
     */
    useEffect(() => {
      if (!mapRef) return
      if (curHoverC && curHoverC === curConstituency) return // exclude hover event from current constituency polygon

      if (curHoverC) {
        mapRef.data.overrideStyle(curHoverC.mapFeature, {
          strokeWeight: curHoverC === curConstituency ? 2 : 1,
          strokeColor: '#333333',
          zIndex: 1
        })
      } else {
        mapRef.data.revertStyle()
      }
    }, [curHoverC])


    const cHoverTextTotal = c => c && c.getProperties().length > 1 ? 'properties' : 'property'
    const cSummaryText = c => c && (c.getFilteredProperties(filterOptions).length + '/' + c.getProperties().length)
    const curHoverPVal = p => p && p.getPropertyValue(filterOptions)
    const curHoverCCopy = curHoverC && curHoverC !== curConstituency && curHoverC
    return (
      <div className="map-container">
        {(curHoverP || curHoverCCopy) ?
        <div className="info-bubble" style={overlayPos}>
          {curHoverP ?
          <div className="hover-property-text">
            <b>{curHoverP.name}</b><br />
            Score: <b className="score" style={{color: MARKER_COLOR_SCHEME[Math.floor(curHoverPVal(curHoverP) * 10)]}}>{(curHoverPVal(curHoverP) * 100).toFixed(0)}%</b>
          </div>
          : 
          <div>
              <b>{curHoverCCopy.name}</b><br />
              <b>{cSummaryText(curHoverCCopy)}</b> {cHoverTextTotal(curHoverCCopy)}
            </div>
          }
          
        </div>
         : ""}
        <div className="map-content"></div>
      </div>
    )
  }

  export default MapUI
  