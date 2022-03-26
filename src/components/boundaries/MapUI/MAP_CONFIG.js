const CONSTITUENCY_MAP_CONFIG = {
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

  export {CONSTITUENCY_MAP_CONFIG, MAP_STYLES}