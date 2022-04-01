import { dbMgr } from "../controls/Mgr"

/**
 * An entity class representing a Constituency
 */
class Constituency {
    /**
     * @param {String} name constituency name
     */
    constructor (name) {
        /** @public */
        this.name = name
        /** @public */
        this.properties = []
        /** @public */
        this.mapFeature = null
        // this.avgPropertiesCount = 0
    }

    /**
     * 
     * @param {Object} filterOpts filter option
     * @return {number} calculated value that evaluate a constituency as a whole
     */
    getConstituencyValue(filterOpts) {
        const filteredProperties = this.getFilteredProperties(filterOpts)
        return filteredProperties.reduce((acc, p) => {
            return acc + p.getPropertyValue(filterOpts)
        }, 0) * filteredProperties.length / dbMgr.getAvgPropertiesCount()
        // return 1
    }

    /**
     * 
     * @returns {Property[]} return filtered list of properties belong to this constituency
     */
    getFilteredProperties(filterOpts) {
        const {enbloc: {threshold: enblocT}, distToMrt: {threshold: mrtT}, distToSchool: {threshold: schoolT}} = filterOpts
        return this.properties.filter(p => {
            const {valueProps: {enbloc}, avgMrtDist, avgSchoolDist} = p
            return enbloc >= enblocT && avgMrtDist <= mrtT && avgSchoolDist <= schoolT
        })
    }

    /**
     * 
     * @returns {Property[]} return all properties belong to this constituency
     */
    getProperties () {
        return this.properties
    }
}

export default Constituency
