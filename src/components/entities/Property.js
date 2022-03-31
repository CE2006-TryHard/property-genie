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
            enbloc: ENBLOC[enblocID+""].val,
            distToMrt: this.getDistValue(avgMrtDist),
            distToSchool: this.getDistValue(avgSchoolDist)
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
        const {enbloc: enblocVal, distToMrt: distToMrtVal, distToSchool: distToSchoolVal} = this.valueProps
        const {
                enbloc: {checked: enblocChecked},
                distToMrt: {checked: distToMrtChecked},
                distToSchool: {checked: distToSchoolChecked}
            } = filterOpts
        // all three are checked
        if (enblocChecked && distToMrtChecked && distToSchoolChecked) {
            return enblocVal * 0.4 + distToMrtVal * 0.35 + distToSchoolVal * 0.25
        }
        // only enbloc and distToMrt are checked
        if (enblocChecked && distToMrtChecked && !distToSchoolChecked) {
            return enblocVal * 0.55 + distToMrtVal * 0.45
        }
        // only enbloc and distToSchool are checked
        if (enblocChecked && !distToMrtChecked && distToSchoolChecked) {
            return enblocVal * 0.6 + distToSchoolVal * 0.4
        }
        // only distToMrt and distToSchool are checked
        if (!enblocChecked && distToMrtChecked && distToSchoolChecked) {
            return distToMrtVal * 0.6 + distToSchoolVal * 0.4
        }

        // only one of them are checked or all are unchecked
        const checkedOption = Object.keys(filterOpts)
        .filter(key => filterOpts[key].checked)
        .map(key => this.valueProps[key])[0]
        return checkedOption || 0
    }
}

export default Property
