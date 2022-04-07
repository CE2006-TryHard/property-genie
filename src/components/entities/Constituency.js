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
        /** @public */
        this.score = 0
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
            return acc + p.getScore()
        }, 0) * filteredProperties.length / dbMgr.totalNoOfFilteredProperties
    }

    getScore () {
        return this.score
    }

    updateConstituencyScore(filterOpts, avgConstituencyValue) {
        let score = 0
        if (avgConstituencyValue) {
            score = this.getConstituencyValue(filterOpts) / avgConstituencyValue
        }

        this.score = score > 1 ? 1 : score
    }



    /**
     * 
     * @returns {Property[]} return filtered list of properties belong to this constituency
     */
    getFilteredProperties(filterOpts) {
        const {score: {threshold: scoreT}, enbloc: {threshold: enblocT}, distToMrt: {threshold: mrtT}, distToSchool: {threshold: schoolT}} = filterOpts
        return this.properties.filter(p => {
            const {valueProps: {enbloc}, avgMrtDist, avgSchoolDist} = p
            return p.getScore()*100 >= scoreT &&
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
