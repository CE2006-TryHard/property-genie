const MARKER_COLOR_SCHEME = ['#FF503F', '#FF833F', '#FF993F', '#FFB33F', '#FFC93F', '#FCE63F', '#EBE63F', '#D2E63F', '#BFE63F', '#9FE63F', '#75E63F']

const CONSTITUENCY_MAP_CONFIG = {
    'ALJUNIED': {center: [1.355571, 103.900862], zoom: 13.5},
    'ANG MO KIO': {center: [1.396758, 103.866529], zoom: 13.5},
    'BISHAN-TOA PAYOH': {center: [1.347334, 103.832197], zoom: 14},
    'BUKIT BATOK': {center: [1.348707, 103.74774], zoom: 16},
    'BUKIT PANJANG': {center: [1.375512, 103.774227], zoom: 15},
    'CHUA CHU KANG': {center: [1.398165, 103.704996], zoom: 13},
    'EAST COAST': {center: [1.368579, 103.997885], zoom: 12.7},
    'HOLLAND-BUKIT TIMAH': {center: [1.365147, 103.785196], zoom: 13},
    'HONG KAH NORTH': {center: [1.364495, 103.73126], zoom: 14},
    'HOUGANG': {center: [1.367927, 103.896055], zoom: 15},
    'JALAN BESAR': {center: [1.298595, 103.857603], zoom: 13.5},
    'JURONG': {center: [1.329108, 103.743053], zoom: 14},
    'KEBUN BARU': {center: [1.383029, 103.825331], zoom: 14},
    'MACPHERSON': {center: [1.325367, 103.885069], zoom: 15},
    'MARINE PARADE': {center: [1.328799, 103.896055], zoom: 13.5},
    'MARSILING-YEW TEE': {center: [1.428334, 103.764219], zoom: 13},
    'MARYMOUNT': {center: [1.359003, 103.84387], zoom: 14.5},
    'MOUNTBATTEN': {center: [1.298595, 103.882322], zoom: 14},
    'NEE SOON': {center: [1.423529, 103.83151], zoom: 13.3},
    'PASIR RIS-PUNGGOL': {center: [1.39058, 103.924894], zoom: 13.3},
    'PIONEER': {center: [1.33841, 103.701048], zoom: 15},
    'POTONG PASIR': {center: [1.33635, 103.871336], zoom: 14},
    'PUNGGOL WEST': {center: [1.404995, 103.895368], zoom: 15},
    'RADIN MAS': {center: [1.277314, 103.819837], zoom: 14},
    'SEMBAWANG': {center: [1.456478,103.810224], zoom: 13.3},
    'SENGKANG': {center: [1.392639, 103.896742], zoom: 14},
    'TAMPINES': {center: [1.361063, 103.939314], zoom: 13.4},
    'TANJONG PAGAR': {center: [1.293927, 103.826223], zoom: 13},
    'WEST COAST': {center: [1.281433, 103.704481], zoom: 12},
    'YIO CHU KANG': {center: [1.382343, 103.840437], zoom: 14},
    'YUHUA': {center: [1.341155, 103.738813], zoom: 15}
  }
  
  const MAP_STYLES = [
    {
      "featureType": "administrative.locality",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape.natural.terrain",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.attraction",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.government",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.place_of_worship",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]

  export {CONSTITUENCY_MAP_CONFIG, MAP_STYLES, MARKER_COLOR_SCHEME}