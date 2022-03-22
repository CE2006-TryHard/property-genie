const enblocRank = {
    '<20%': 0.05,
    '20%-39%': 0.25,
    '40%-59%': 0.5,
    '60%-79%': 0.75,
    '>80%': 1
}

const QUALIFY_DIST = 0.5

export default class Property {
    constructor (props) {
        const {name, address,description, price_range, lat, lng, enbloc, mrt, school, avgMrtDist, avgSchoolDist, district} = props
        this.name = name
        this.label = name
        this.address = address
        this.description = description
        this.price_range = price_range
        this.lat = lat
        this.lng = lng
        this.mrt = mrt
        this.school = school
        this.enblocRank = enbloc
        this.avgMrtDist = avgMrtDist
        this.avgSchoolDist = avgSchoolDist
        this.district = district
        this.valueProps = {
            enbloc: enblocRank[enbloc] * 0.4,
            distToMrt: ((avgMrtDist / QUALIFY_DIST) > 1 ? 1 : (avgMrtDist / QUALIFY_DIST)) * 0.35,
            distToSchool: ((avgSchoolDist / QUALIFY_DIST) > 1 ? 1 : (avgSchoolDist / QUALIFY_DIST)) * 0.25
        }
    }

    getPropertyValue (filterOpts) {
        let value = 0
        Object.keys(filterOpts)
            .filter(key => filterOpts[key].checked)
            .forEach(key => {
                // console.log('key',key)
                value += this.valueProps[key]
            })
            // console.log('prop value', value)
        return value
    }
}