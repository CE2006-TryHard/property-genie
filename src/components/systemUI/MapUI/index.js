import React from 'react'
import "./MapUI.scss"
import {Loader} from "@googlemaps/js-api-loader"


export default class MapUI extends React.Component {
  constructor(props) {
    super(props)

    this.map = null
  }
  // state = {
  //   showingInfoWindow: false,
  //   activeMarker: {},
  //   selectedPlace: {}
  // }

  render() {
    const mapStyles = {
      width: '100%',
      height: '100%'
    }

    return (
      <div className="map-container">
        <div className="map-content"></div>
      </div>
    )
  }

  componentDidMount() {
    const loader = new Loader({
      apiKey: 'AIzaSyAvXrCz1aaHL0MH8a6qQFW9zfwS8FP_mks'
    })

    loader.load().then(google => {
      this.map = new google.maps.Map(document.querySelector(".map-content"), {
        center: {lat:1.360514, lng: 103.840300},
        zoom: 11,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
        draggable: false,
        disableDoubleClickZoom: true
      })

      this.map.data.loadGeoJson('data/districts_simplify.geojson')
      console.log(this.map.data)
      this.map.data.setStyle(feature => {
        const color = feature.getProperty('Name') === 'SEMBAWANG' ? 'red' : 'green'
        return {
          fillColor: color,
          strokeWeight: 1,
          strokeColor: '#FFFFFF',
          fillOpacity: 0.7
        }
      })

      this.map.data.addListener('mouseover', e => {
        console.log(e.feature.getProperty('Name'))
      })
    })
  }

  componentDidUpdate(prevProps) {
    console.log('check prop update map')
  }
}
