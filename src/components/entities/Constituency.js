import { dbMgr } from "../controls/Mgr"

/**
 * An entity class representing a Constituency
 */
class Constituency {
    /**
     * @param {String} name constituency name
     */
    constructor (id, name) {
        this.id = id
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
        if (!dbMgr.totalNoOfFilteredProperties) return 0
        
        
        return filteredProperties.reduce((acc, p) => {
            return acc + p.getPropertyValue(filterOpts)
        }, 0) * filteredProperties.length / dbMgr.totalNoOfFilteredProperties
        // return 1
    }

    getConstituencyScore(filterOpts) {
        if (!dbMgr.avgConstituencyValue) return 0
        const score = this.getConstituencyValue(filterOpts) / dbMgr.avgConstituencyValue
        return score > 1 ? 1 : score
    }

    /**
     * 
     * @returns {Property[]} return filtered list of properties belong to this constituency
     */
    getFilteredProperties(filterOpts) {
        const {score: {threshold: scoreT}, enbloc: {threshold: enblocT}, distToMrt: {threshold: mrtT}, distToSchool: {threshold: schoolT}} = filterOpts
        return this.properties.filter(p => {
            const {valueProps: {enbloc}, avgMrtDist, avgSchoolDist} = p
            return p.getPropertyValue(filterOpts)*100 >= scoreT &&
                    enbloc <= enblocT &&
                    avgMrtDist <= mrtT &&
                    avgSchoolDist <= schoolT
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
