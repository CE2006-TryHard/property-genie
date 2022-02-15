import React from 'react'
import './sgMap.scss'
import {Loader} from '@googlemaps/js-api-loader'


class SgMap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="sgmap-container">
            <div className="sgmap-content">

            </div>
        </div>
    )
  }

  initMap() {
    // https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications
    //AIzaSyAvXrCz1aaHL0MH8a6qQFW9zfwS8FP_mks
    const loader = new Loader({
      apiKey: "AIzaSyAvXrCz1aaHL0MH8a6qQFW9zfwS8FP_mks",
      version: "weekly"
      // ...additionalOptions,
    });
    
    loader.load().then(() => {
      map = new google.maps.Map(document.querySelector(".sgmap-content"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });
  }
}

export default SgMap