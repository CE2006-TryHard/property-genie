import React from 'react'
import {Loader} from "@googlemaps/js-api-loader"
// import dotIcon from './../images/dotIcon.svg'


export default class MapUI extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  }

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
      const map = new google.maps.Map(document.querySelector(".map-content"), {
        center: {lat:1.360514, lng: 103.810300},
        zoom: 11.5
      })
    })
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }
}
