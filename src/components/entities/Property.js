const enblocRank = {
    '<20%': 0,
    '20%-39%': 1,
    '39%-49%': 2,
    '49%-59%': 3,
    '59%-69%': 4,
    '69%-79%': 5,
    '>80%': 6
}

export default class Property {
    constructor (props) {
        const {name, description, price_range, lat, lng, enbloc, distToMrt, distToSchool} = props
        this.name = name
        this.label = name
        this.description = description
        this.price_range = price_range
        this.lat = lat
        this.lng = lng
        this.valueProps = {
            enbloc: enblocRank[enbloc],
            distToMrt: 2 / distToMrt,
            distToSchool: 2 / distToSchool
        }
        this.value = 0
    }

    getPropertyValue (filterOpts) {
        let value = 0
        Object.keys(filterOpts)
            .filter(key => filterOpts[key])
            .forEach(key => {
                value += this.valueProps[key]
            })
        return value
    }
}