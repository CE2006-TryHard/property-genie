import {ENBLOC} from './../CONFIG'

export default class Property {
    constructor (props) {
        const {placeID, name, address, mrts, schools, lat, lng, enblocID, avgMrtDist, avgSchoolDist, constituency} = props
        this.placeID = placeID
        this.name = name
        this.address = address
        this.lat = lat
        this.lng = lng
        this.mrts = mrts
        this.schools = schools
        this.enblocStr = ENBLOC[enblocID].label
        this.avgMrtDist = avgMrtDist
        this.avgSchoolDist = avgSchoolDist
        this.constituency = constituency
        this.reviews = null
        this.valueProps = {
            enbloc: ENBLOC[enblocID+""].val * 0.4,
            distToMrt: this.getDistValue(avgMrtDist) * 0.35,
            distToSchool: this.getDistValue(avgSchoolDist) * 0.25
        }
    }

    setReviews(val) {
        this.reviews = val
    }

    getDistValue (val) {
        // distance beyond 1km => 1
        // distance below => use it as it is
        if (val >= 0 && val < 0.2) return 1
        if (val >= 0.2 && val < 0.4) return 0.75
        if (val >= 0.4 && val < 0.6) return 0.5
        if (val >= 0.6 && val < 0.8) return 0.25
        // if (val >= 0.8 && val <= 1) return 0
        return 0
    }

    getPropertyValue (filterOpts) {
        let value = 0
        Object.keys(filterOpts)
            .filter(key => filterOpts[key].checked)
            .forEach(key => {
                value += this.valueProps[key]
            })
        
        return value
    }
}