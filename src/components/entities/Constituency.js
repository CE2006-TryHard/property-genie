export const CONSTITUENCY_NAME = {
    1: {name: 'ALJUNIED'},
    2: {name: 'ANG MO KIO'},
    3: {name: 'BISHAN-TOA PAYOH'},
    4: {name: 'BUKIT BATOK'},
    5: {name: 'BUKIT PANJANG'},
    6: {name: 'CHUA CHU KANG'},
    7: {name: 'EAST COAST'},
    8: {name: 'HOLLAND-BUKIT TIMAH'},
    9: {name: 'HONG KAH NORTH'},
    10: {name: 'HOUGANG'},
    11: {name: 'JALAN BESAR'},
    12: {name: 'JURONG'},
    13: {name: 'KEBUN BARU'},
    14: {name: 'MACPHERSON'},
    15: {name: 'MARINE PARADE'},
    16: {name: 'MARSILING-YEW TEE'},
    17: {name: 'MARYMOUNT'},
    18: {name: 'MOUNTBATTEN'},
    19: {name: 'NEE SOON'},
    20: {name: 'PASIR RIS-PUNGGOL'},
    21: {name: 'PIONEER'},
    22: {name: 'POTONG PASIR'},
    23: {name: 'PUNGGOL WEST'},
    24: {name: 'RADIN MAS'},
    25: {name: 'SEMBAWANG'},
    26: {name: 'SENGKANG'},
    27: {name: 'TAMPINES'},
    28: {name: 'TANJONG PAGAR'},
    29: {name: 'WEST COAST'},
    30: {name: 'YIO CHU KANG'},
    31: {name: 'YUHUA'}
}

export default class Constituency {
    constructor (name) {
        this.name = name
        this.properties = []
        this.avgPropertiesCount = 0
    }

    getConstituencyValue(filterOpts) {
        return this.properties.reduce((acc, p) => {
            return acc + p.getPropertyValue(filterOpts)
        }, 0) * this.properties.length / this.avgPropertiesCount
        // return 1
    }
}