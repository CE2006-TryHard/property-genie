const CONSTITUENCY_NAME = {
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

const LINES = {
    "NS": {
        "name": "North South",
        "bgColor": "#E32426",
        "textColor": 'white'

    },
    "EW": {
        "name": "East West",
        "bgColor": "#0E9548",
        "textColor": 'white'
    },
    "CC": {
        "name": "Circle",
        "bgColor": "#F59B21",
        "textColor": '#333333'
    },
    "CE": {
        "name": "Circle Extension",
        "bgColor": "#F59B21",
        "textColor": '#333333'
    },
    "DT": {
        "name": "Downtown",
        "bgColor": "#045CA5",
        "textColor": 'white'
    },
    "NE": {
        "name": "North East",
        "bgColor": "#8F4199",
        "textColor": 'white'
    },
    "CG": {
        "name": "Changi Airport Branch",
        "bgColor": "grey",
        "textColor": 'white'
    },
    "TE": {
        "name": "Thomson–East Coast",
        "bgColor": "#9D5B25",
        "textColor": 'white'
    },
    "BP": {
        "name": "Bukit Panjang LRT",
        "bgColor": "#728675",
        "textColor": 'white'
    }
}

const STATIONS = { 
    "1": { "name": "ADMIRALTY", "code": ["NS10"] }, "2": { "name": "ALJUNIED", "code": ["EW9"] }, "3": { "name": "ANG MO KIO", "code": ["NS16"] }, 
    "4": { "name": "BARTLEY", "code": ["CC12"] }, "5": { "name": "BAYFRONT", "code": ["DT16", "CE1"] }, "6": { "name": "BEAUTY WORLD", "code": ["DT5"] }, 
    "7": { "name": "BEDOK", "code": ["EW5"] }, "8": { "name": "BEDOK NORTH", "code": ["DT29"] }, "9": { "name": "BEDOK RESERVOIR", "code": ["DT30"] }, 
    "10": { "name": "BENCOOLEN", "code": ["DT21"] }, "11": { "name": "BENDEMEER", "code": ["DT23"] }, "12": { "name": "BISHAN", "code": ["CC15", "NS17"] }, 
    "13": { "name": "BOON KENG", "code": ["NE9"] }, "14": { "name": "BOON LAY", "code": ["EW27"] }, "15": { "name": "BOTANIC GARDENS", "code": ["DT9", "CC19"] }, 
    "16": { "name": "BRADDELL", "code": ["NS18"] }, "17": { "name": "BRAS BASAH", "code": ["CC2"] }, "18": { "name": "BUANGKOK", "code": ["NE15"] }, 
    "19": { "name": "BUGIS", "code": ["DT14", "EW12"] }, "20": { "name": "BUKIT BATOK", "code": ["NS2"] }, "21": { "name": "BUKIT GOMBAK", "code": ["NS3"] },
    "22": { "name": "BUKIT PANJANG", "code": ["DT1", "BP6"] }, "23": { "name": "BUONA VISTA", "code": ["CC22", "EW21"] }, "24": { "name": "CALDECOTT", "code": ["CC17"] }, 
    "25": { "name": "CANBERRA", "code": ["NS12"] }, "26": { "name": "CASHEW", "code": ["DT2"] }, "27": { "name": "CHANGI AIRPORT", "code": ["CG2"] }, 
    "28": { "name": "CHINATOWN", "code": ["DT19", "NE4"] }, "29": { "name": "CHINESE GARDEN", "code": ["EW25"] }, "30": { "name": "CHOA CHU KANG", "code": ["NS4", "BP1"] },
    "31": { "name": "CITY HALL", "code": ["EW13", "NS25"] }, "32": { "name": "CLARKE QUAY", "code": ["NE5"] }, "33": { "name": "CLEMENTI", "code": ["EW23"] }, 
    "34": { "name": "COMMONWEALTH", "code": ["EW20"] }, "35": { "name": "DAKOTA", "code": ["CC8"] }, "36": { "name": "DHOBY GHAUT", "code": ["CC1", "NS24", "NE6"] }, 
    "37": { "name": "DOVER", "code": ["EW22"] }, "38": { "name": "DOWNTOWN", "code": ["DT17"] }, "39": { "name": "ESPLANADE", "code": ["CC3"] }, 
    "40": { "name": "EUNOS", "code": ["EW7"] }, "41": { "name": "EXPO", "code": ["DT35", "CG1"] }, "42": { "name": "FARRER PARK", "code": ["NE8"] }, 
    "43": { "name": "FARRER ROAD", "code": ["CC20"] }, "44": { "name": "FORT CANNING", "code": ["DT20"] }, "45": { "name": "GEYLANG BAHRU", "code": ["DT24"] }, 
    "46": { "name": "GUL CIRCLE", "code": ["EW30"] }, "47": { "name": "HARBOURFRONT", "code": ["CC29", "NE1"] }, "48": { "name": "HAW PAR VILLA", "code": ["CC25"] }, 
    "49": { "name": "HILLVIEW", "code": ["DT3"] }, "50": { "name": "HOLLAND VILLAGE", "code": ["CC21"] }, "51": { "name": "HOUGANG", "code": ["NE14"] }, 
    "52": { "name": "JALAN BESAR", "code": ["DT22"] }, "53": { "name": "JOO KOON", "code": ["EW29"] }, "54": { "name": "JURONG EAST", "code": ["EW24", "NS1"] }, 
    "55": { "name": "KAKI BUKIT", "code": ["DT28"] }, "56": { "name": "KALLANG", "code": ["EW10"] }, "57": { "name": "KEMBANGAN", "code": ["EW6"] }, 
    "58": { "name": "KENT RIDGE", "code": ["CC24"] }, "59": { "name": "KHATIB", "code": ["NS14"] }, "60": { "name": "KING ALBERT PARK", "code": ["DT6"] }, 
    "61": { "name": "KOVAN", "code": ["NE13"] }, "62": { "name": "KRANJI", "code": ["NS7"] }, "63": { "name": "LABRADOR PARK", "code": ["CC27"] }, 
    "64": { "name": "LAKESIDE", "code": ["EW26"] }, "65": { "name": "LAVENDER", "code": ["EW11"] }, "66": { "name": "LITTLE INDIA", "code": ["DT12", "NE7"] }, 
    "67": { "name": "LORONG CHUAN", "code": ["CC14"] }, "68": { "name": "MACPHERSON", "code": ["DT26", "CC10"] }, "69": { "name": "MARINA BAY", "code": ["CE2", "NS27"] }, 
    "70": { "name": "MARINA SOUTH PIER", "code": ["NS28"] }, "71": { "name": "MARSILING", "code": ["NS"] }, "72": { "name": "MARYMOUNT", "code": ["CC16"] }, 
    "73": { "name": "MATTAR", "code": ["DT25"] }, "74": { "name": "MOUNTBATTEN", "code": ["CC7"] }, "75": { "name": "NEWTON", "code": ["DT11", "NS21"] }, 
    "76": { "name": "NICOLL HIGHWAY", "code": ["CC5"] }, "77": { "name": "NOVENA", "code": ["NS20"] }, "78": { "name": "ONE-NORTH", "code": ["CC23"] }, 
    "79": { "name": "ORCHARD", "code": ["NS22"] }, "80": { "name": "OUTRAM PARK", "code": ["NE3", "EW16"] }, "81": { "name": "PASIR PANJANG", "code": ["CC26"] }, 
    "82": { "name": "PASIR RIS", "code": ["EW1"] }, "83": { "name": "PAYA LEBAR", "code": ["CC9", "EW8"] }, "84": { "name": "PIONEER", "code": ["EW28"] }, 
    "85": { "name": "POTONG PASIR", "code": ["NE10"] }, "86": { "name": "PROMENADE", "code": ["DT15", "CC4"] }, "87": { "name": "PUNGGOL", "code": ["NE17"] }, 
    "88": { "name": "QUEENSTOWN", "code": ["EW19"] }, "89": { "name": "RAFFLES PLACE", "code": ["EW14", "NS26"] }, "90": { "name": "REDHILL", "code": ["EW18"] }, 
    "91": { "name": "ROCHOR", "code": ["DT13"] }, "92": { "name": "SEMBAWANG", "code": ["NS11"] }, "93": { "name": "SENGKANG", "code": ["NE16"] }, 
    "94": { "name": "SERANGOON", "code": ["CC13", "NE12"] }, "95": { "name": "SIMEI", "code": ["EW3"] }, "96": { "name": "SIXTH AVENUE", "code": ["DT7"] }, 
    "97": { "name": "SOMERSET", "code": ["NS23"] }, "98": { "name": "STADIUM", "code": ["CC6"] }, "99": { "name": "STEVENS", "code": ["DT10"] }, 
    "123": { "name": "SUNGEI BEDOK", "code": ["TE", "DT"] }, "100": { "name": "TAI SENG", "code": ["CC11"] }, "101": { "name": "TAMPINES", "code": ["DT32", "EW2"] }, 
    "102": { "name": "TAMPINES EAST", "code": ["DT33"] }, "103": { "name": "TAMPINES WEST", "code": ["DT31"] }, "104": { "name": "TAN KAH KEE", "code": ["DT8"] }, 
    "105": { "name": "TANAH MERAH", "code": ["EW4", "CG"] }, "106": { "name": "TANJONG PAGAR", "code": ["EW15"] }, "107": { "name": "TELOK AYER", "code": ["DT18"] }, 
    "108": { "name": "TELOK BLANGAH", "code": ["CC28"] }, "109": { "name": "TIONG BAHRU", "code": ["EW17"] }, "110": { "name": "TOA PAYOH", "code": ["NS19"] }, 
    "111": { "name": "TUAS CRESCENT", "code": ["EW31"] }, "112": { "name": "TUAS LINK", "code": ["EW33"] }, "113": { "name": "TUAS WEST ROAD", "code": ["EW32"] }, 
    "114": { "name": "UBI", "code": ["DT27"] }, "115": { "name": "UPPER CHANGI", "code": ["DT34"] }, "116": { "name": "WOODLANDS", "code": ["TE2", "NS9"] }, 
    "117": { "name": "WOODLANDS NORTH", "code": ["TE1"] }, "118": { "name": "WOODLANDS SOUTH", "code": ["TE3"] }, "119": { "name": "WOODLEIGH", "code": ["NE11"] },
    "120": { "name": "YEW TEE", "code": ["NS5"] }, "121": { "name": "YIO CHU KANG", "code": ["NS15"] }, "122": { "name": "YISHUN", "code": ["NS13"] } }

const ENBLOC = {
    '1': {val: 0, label: '<20%'},  
    '2': {val: 0.25, label: '20%-39%'},
    '3': {val: 0.5, label: '40%-59%'},
    '4': {val: 0.75, label: '60%-79%'},
    '5': {val: 1, label: '>80%'}
}

const SCHOOLS = {
    1: "ST. MARGARET'S PRIMARY SCHOOL", 2: 'ANGLO-CHINESE SCHOOL (JUNIOR)', 3: 'STAMFORD PRIMARY SCHOOL',
    4: 'GEYLANG METHODIST SCHOOL (PRIMARY)', 5: 'KONG HWA SCHOOL', 6: '68 PRIMARY SCHOOL', 7: '122 PRIMARY SCHOOL',
    8: 'AHMAD IBRAHIM PRIMARY SCHOOL', 9: 'CHONGFU SCHOOL', 10: 'PEI HWA PRESBYTERIAN PRIMARY SCHOOL', 11: "METHODIST GIRLS' SCHOOL (PRIMARY)",
    12: 'BUKIT TIMAH PRIMARY SCHOOL', 13: 'BALESTIER HILL PRIMARY SCHOOL', 14: '42 PRIMARY SCHOOL', 15: 'NANYANG PRIMARY SCHOOL',
    16: "RAFFLES GIRLS' PRIMARY SCHOOL", 17: "SINGAPORE CHINESE GIRLS' PRIMARY SCHOOL", 18: 'TANJONG KATONG PRIMARY SCHOOL',
    19: "HAIG GIRLS' SCHOOL", 20: 'TAO NAN SCHOOL', 21: 'RIVER VALLEY PRIMARY SCHOOL', 22: "ST. ANDREW'S JUNIOR SCHOOL",
    23: "ST. JOSEPH'S INSTITUTION JUNIOR", 24: '11 PRIMARY SCHOOL', 25: 'XINMIN PRIMARY SCHOOL', 26: 'XINGHUA PRIMARY SCHOOL',
    27: 'ZHONGHUA PRIMARY SCHOOL', 28: 'ANGLO-CHINESE SCHOOL (PRIMARY)', 29: 'ROSYTH SCHOOL', 30: 'KHENG CHENG SCHOOL',
    31: 'CHIJ (KATONG) PRIMARY', 32: 'NGEE ANN PRIMARY SCHOOL', 33: 'CANTONMENT PRIMARY SCHOOL', 34: 'CHIJ (KELLOCK)',
    35: 'RADIN MAS PRIMARY SCHOOL', 36: 'CEDAR PRIMARY SCHOOL', 37: 'MARIS STELLA HIGH SCHOOL',
    38: 'HONG WEN SCHOOL', 39: 'YANGZHENG PRIMARY SCHOOL', 40: '88 PRIMARY SCHOOL', 41: 'ZHANGDE PRIMARY SCHOOL',
    42: 'EDGEFIELD PRIMARY SCHOOL', 43: 'COMPASSVALE PRIMARY SCHOOL', 44: 'RIVERVALE PRIMARY SCHOOL',
    45: "83 METHODIST GIRLS' SCHOOL (PRIMARY)", 46: 'GAN ENG SENG PRIMARY SCHOOL', 47: 'NEW TOWN PRIMARY SCHOOL',
    48: 'HENRY PARK PRIMARY SCHOOL', 49: 'PEI TONG PRIMARY SCHOOL', 50: 'OPERA ESTATE PRIMARY SCHOOL', 51: "ST. STEPHEN'S SCHOOL",
    52: 'RED SWASTIKA SCHOOL', 53: 'YU NENG PRIMARY SCHOOL', 54: "ST. ANTHONY'S CANOSSIAN PRIMARY SCHOOL",
    55: "ST. HILDA'S PRIMARY SCHOOL", 56: 'POI CHING SCHOOL', 57: 'JUNYUAN PRIMARY SCHOOL', 58: '7 WEST PRIMARY SCHOOL', 
    59: 'DAMAI PRIMARY SCHOOL', 60: 'EAST COAST PRIMARY SCHOOL', 61: '40 PRIMARY SCHOOL', 62: 'TELOK KURAU PRIMARY SCHOOL', 
    63: '33 PRIMARY SCHOOL', 64: 'NORTH VISTA PRIMARY SCHOOL', 65: 'NORTH SPRING PRIMARY SCHOOL', 66: '87 PRIMARY SCHOOL', 
    67: 'WHITE SANDS PRIMARY SCHOOL', 68: 'EAST SPRING PRIMARY SCHOOL', 69: '82 PRIMARY SCHOOL', 70: 'TEMASEK PRIMARY SCHOOL', 
    71: '7 GREEN PRIMARY SCHOOL', 72: 'CHANGKAT PRIMARY SCHOOL', 73: 'FENGSHAN PRIMARY SCHOOL', 74: "ST. GABRIEL'S PRIMARY SCHOOL", 
    75: '116 RING PRIMARY SCHOOL', 76: 'GREENWOOD PRIMARY SCHOOL', 77: '116 PRIMARY SCHOOL', 78: 'ELIAS PARK PRIMARY SCHOOL', 
    79: 'PARK VIEW PRIMARY SCHOOL', 80: 'MERIDIAN PRIMARY SCHOOL', 81: 'CATHOLIC HIGH SCHOOL', 82: 'CHIJ PRIMARY (110)', 
    83: '72 CONVENT SCHOOL', 84: 'FIRST 110 PRIMARY SCHOOL', 85: 'AI TONG SCHOOL', 86: '3 PRIMARY SCHOOL', 
    87: 'GUANGYANG PRIMARY SCHOOL', 88: 'MAHA BODHI SCHOOL', 89: 'GREENRIDGE PRIMARY SCHOOL', 90: 'BEACON PRIMARY SCHOOL', 
    91: 'ZHENGHUA PRIMARY SCHOOL', 92: 'QIFA PRIMARY SCHOOL', 93: 'CASUARINA PRIMARY SCHOOL', 94: 'LOYANG PRIMARY SCHOOL', 
    95: 'CHIJ OUR LADY OF THE NATIVITY', 96: 'NAN HUA PRIMARY SCHOOL', 97: 'CHIJ OUR LADY OF GOOD COUNSEL', 
    98: 'KEMING PRIMARY SCHOOL', 99: 'ANDERSON PRIMARY SCHOOL', 100: 'MAYFLOWER PRIMARY SCHOOL', 
    101: "CHIJ ST. NICHOLAS GIRLS' SCHOOL (PRIMARY)", 102: 'FAIRFIELD METHODIST SCHOOL (PRIMARY)', 
    103: 'BLANGAH RISE PRIMARY SCHOOL', 104: '92 PRIMARY SCHOOL', 105: 'WELLINGTON PRIMARY SCHOOL', 106: '25 PRIMARY SCHOOL', 
    107: 'PEI CHUN PUBLIC SCHOOL', 108: 'SI LING PRIMARY SCHOOL', 109: 'INNOVA PRIMARY SCHOOL', 110: 'WOODGROVE PRIMARY SCHOOL', 
    111: 'GRIFFITHS PRIMARY SCHOOL', 112: 'RULANG PRIMARY SCHOOL', 113: '64 PRIMARY SCHOOL', 114: '14 GARDEN PRIMARY SCHOOL', 
    115: 'JING SHAN PRIMARY SCHOOL', 116: 'TECK GHEE PRIMARY SCHOOL', 117: 'LIANHUA PRIMARY SCHOOL', 
    118: 'CHIJ OUR LADY QUEEN OF PEACE', 119: "ST. ANTHONY'S PRIMARY SCHOOL", 120: '22 PRIMARY SCHOOL', 
    121: 'TOWNSVILLE PRIMARY SCHOOL', 122: 'SENG KANG PRIMARY SCHOOL', 123: 'NAN CHIAU PRIMARY SCHOOL', 124: '51 PRIMARY SCHOOL', 
    125: 'QIAONAN PRIMARY SCHOOL', 126: 'CHONGZHENG PRIMARY SCHOOL', 127: 'CORAL PRIMARY SCHOOL', 128: '121 PRIMARY SCHOOL', 
    129: 'JIEMIN PRIMARY SCHOOL', 130: 'PEIYING PRIMARY SCHOOL', 131: "HOLY INNOCENTS' PRIMARY SCHOOL", 
    132: 'GREENDALE PRIMARY SCHOOL', 133: 'MEE TOH SCHOOL', 134: 'HORIZON PRIMARY SCHOOL', 135: 'CANOSSA CONVENT PRIMARY SCHOOL', 
    136: 'DAZHONG PRIMARY SCHOOL', 137: 'FERNVALE PRIMARY SCHOOL', 138: 'ANCHOR GREEN PRIMARY SCHOOL', 
    139: 'BUKIT VIEW PRIMARY SCHOOL', 140: 'DE LA SALLE SCHOOL', 141: 'WEST VIEW PRIMARY SCHOOL', 142: 'TECK WHYE PRIMARY SCHOOL', 
    143: 'NAVAL BASE PRIMARY SCHOOL', 144: 'MONTFORT JUNIOR SCHOOL', 145: 'FUHUA PRIMARY SCHOOL', 146: 'YUHUA PRIMARY SCHOOL', 
    147: 'JURONG PRIMARY SCHOOL', 148: 'PRINCESS ELIZABETH PRIMARY SCHOOL', 149: 'SHUQUN PRIMARY SCHOOL', 
    150: 'NORTH VIEW PRIMARY SCHOOL', 151: 'HUAMIN PRIMARY SCHOOL', 152: 'NORTHLAND PRIMARY SCHOOL', 153: 'SOUTH VIEW PRIMARY SCHOOL', 
    154: 'DA QIAO PRIMARY SCHOOL', 155: 'XISHAN PRIMARY SCHOOL', 156: '1 PRIMARY SCHOOL', 157: '62 PRIMARY SCHOOL', 
    158: 'CHUA CHU KANG PRIMARY SCHOOL', 159: '120 PRIMARY SCHOOL', 160: 'UNITY PRIMARY SCHOOL', 161: 'JURONG WEST PRIMARY SCHOOL', 
    162: 'WEST GROVE PRIMARY SCHOOL', 163: '84 PRIMARY SCHOOL', 164: 'CORPORATION PRIMARY SCHOOL', 165: 'FUCHUN PRIMARY SCHOOL', 
    166: 'EVERGREEN PRIMARY SCHOOL'
}

export {STATIONS, LINES, ENBLOC, SCHOOLS, CONSTITUENCY_NAME}
