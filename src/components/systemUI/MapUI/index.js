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
  'TANJONG PAGAR': {center: [1.2939272740258816, 103.82622377756721], zoom: 13.5},
  'WEST COAST': {center: [1.281433478590405, 103.70448152693658], zoom: 12},
  'YIO CHU KANG': {center: [1.382343084833783, 103.84043733748345], zoom: 14},
  'YUHUA': {center: [1.3411559906872688, 103.7388138023272], zoom: 15}
}

const MAP_CENTER = {lat:1.360514, lng: 103.840300}
const MAP_ZOOM = 11

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
      // isZoom: false
    }
    this.markers = {}
  }

  render() {
    const mapStyles = {
      width: '100%',
      height: '100%'
    }

    const {currentHoverDistrict, currentZoomInDistrict} = this.state

    const [bubbleX, bubbleY] = this.state.bubblePos
    const bubbleStyle = {
      left: bubbleX + 10,
      top: bubbleY + 20
    }

    return (
      <div className="map-container">
        {(currentHoverDistrict && currentHoverDistrict !== currentZoomInDistrict) ?
        <div className="info-bubble" style={bubbleStyle}>
          {currentHoverDistrict.name}
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
      if (!this.markers[district.name][p.name]) {
        this.markers[district.name][p.name] = new googleRef.maps.Marker({
          position: {lat: p.lat, lng: p.lng},
          map: this.map,
          title: p.name
        })

        googleRef.maps.event.addListener(this.markers[district.name][p.name], 'click', () => {
          this.props.onPropertySelect(p)
        })
      }
    })

    Object.keys(this.markers).forEach(dName => {
      Object.keys(this.markers[dName]).forEach(pName => {
        this.markers[dName][pName].setVisible(dName === district.name)
      })
    })
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

      this.map.data.loadGeoJson('data/districts_simplify.geojson')
      this.map.data.setStyle(feature => {
        const color = feature.getProperty('Name') === 'SEMBAWANG' ? 'red' : 'green'
        return {
          cursor: 'default',
          fillColor: color,
          strokeWeight: 1,
          strokeColor: '#FFFFFF',
          fillOpacity: 0.7
        }
      })

      this.map.data.addListener('mousemove', e => {
        const {clientX, clientY, screenX, screenY} = e.domEvent
        const district = dbMgr.getDistricts()[e.feature.getProperty('Name')]
        this.setState({...this.state, bubblePos: [clientX, clientY], currentHoverDistrict: district})
      })

      this.map.data.addListener('click', e => {
        const district = dbMgr.getDistricts()[e.feature.getProperty('Name')]
        this.props.onDistrictSelect(district)
      })

      this.map.data.addListener('mouseout', e => {
        this.setState({...this.state, currentHoverDistrict: null})
      })
    })
  }

  componentDidUpdate(prevProps) {
    const {filterOptions, curDistrict} = prevProps
    if (filterOptions !== this.props.filterOptions) {
      console.log("filter option props update")
    }

    if (curDistrict !== this.props.curDistrict) {
      // console.log('update select district', this.props.curDistrict)
        const district = this.props.curDistrict
        this.setState({...this.state, currentZoomInDistrict: district})
        this.displayPropertiesInDistrict(district)
        this.map.data.setStyle(feature => {
          const isTargetDistrict = district && feature.getProperty('Name') === district.name
          return {
            // ...this.map.data.getStyle(),
            cursor: 'default',
            fillColor: 'green',
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
            fillOpacity: isTargetDistrict ? 0 : 0.7
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
