import {ENBLOC} from './../CONFIG'

/**
 * An entity class representing a Property
 */
class Property {
    constructor (props) {
        const {placeID, name, address, mrts, schools, lat, lng, enblocID, avgMrtDist, avgSchoolDist, constituency} = props
        /** @public */
        this.placeID = placeID
        /** @public */
        this.name = name
        /** @public */
        this.address = address
        /** @public */
        this.lat = lat
        /** @public */
        this.lng = lng
        /** @public */
        this.mrts = mrts
        /** @public */
        this.schools = schools
        /** @public */
        this.enblocStr = ENBLOC[enblocID].label
        /** @public */
        this.avgMrtDist = avgMrtDist
        /** @public */
        this.avgSchoolDist = avgSchoolDist
        /** @public */
        this.constituency = constituency
        /** @public */
        this.reviews = null
        /** @public */
        this.valueProps = {
            enbloc: ENBLOC[enblocID+""].val * 0.4,
            distToMrt: this.getDistValue(avgMrtDist) * 0.35,
            distToSchool: this.getDistValue(avgSchoolDist) * 0.25
        }
    }
    /**
     * @param {Object[]} val update review object related to a property
     */
    setReviews(val) {
        this.reviews = val
    }
    /**
     * 
     * @param {number} val 
     * @returns {number}
     */
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

     /**
     * @param  {Object} filterOpts
     * @returns {number}
     */
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

export default Property
