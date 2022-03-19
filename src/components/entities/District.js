const DISTRICT_NAME = {
    1: {name: 'ALJUNIED', center: [], zoom: 12},
    2: {name: 'ANG MO KIO', center: [], zoom: 12},
    3: {name: 'BISHAN-TOA PAYOH', center: [], zoom: 12},
    4: {name: 'BUKIT BATOK', center: [], zoom: 12},
    5: {name: 'BUKIT PANJANG', center: [], zoom: 12},
    6: {name: 'CHUA CHU KANG', center: [], zoom: 12},
    7: {name: 'EAST COAST', center: [], zoom: 12},
    8: {name: 'HOLLAND-BUKIT TIMAH', center: [], zoom: 12},
    9: {name: 'HONG KAH NORTH', center: [], zoom: 12},
    10: {name: 'HOUGANG', center: [], zoom: 12},
    11: {name: 'JALAN BESAR', center: [], zoom: 12},
    12: {name: 'JURONG', center: [], zoom: 12},
    13: {name: 'KEBUN BARU', center: [], zoom: 12},
    14: {name: 'MACPHERSON', center: [], zoom: 12},
    15: {name: 'MARINE PARADE', center: [], zoom: 12},
    16: {name: 'MARSILING-YEW TEE', center: [], zoom: 12},
    17: {name: 'MARYMOUNT', center: [], zoom: 12},
    18: {name: 'MOUNTBATTEN', center: [], zoom: 12},
    19: {name: 'NEE SOON', center: [], zoom: 12},
    20: {name: 'PASIR RIS-PUNGGOL', center: [], zoom: 12},
    21: {name: 'PIONEER', center: [], zoom: 12},
    22: {name: 'POTONG PASIR', center: [], zoom: 12},
    23: {name: 'PUNGGOL WEST', center: [], zoom: 12},
    24: {name: 'RADIN MAS', center: [], zoom: 12},
    25: {name: 'SEMBAWANG', center: [], zoom: 12},
    26: {name: 'SENGKANG', center: [], zoom: 12},
    27: {name: 'TAMPINES', center: [], zoom: 12},
    28: {name: 'TANJONG PAGAR', center: [], zoom: 12},
    29: {name: 'WEST COAST', center: [], zoom: 12},
    30: {name: 'YIO CHU KANG', center: [], zoom: 12},
    31: {name: 'YUHUA', center: [], zoom: 12}
}

export default class District {
    constructor (id) {
        this.id = id
        const {name, center, zoom} = DISTRICT_NAME[id]
        this.name = name
        this.center = center
        this.zoom = zoom
        this.properties = []
    }

    getDistrictValue() {
        return 1
    }
}