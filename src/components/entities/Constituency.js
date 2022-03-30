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
        this.avgPropertiesCount = 0
    }

    /**
     * 
     * @param {Object} filterOpts filter option
     * @return {number} calculated value that evaluate a constituency as a whole
     */
    getConstituencyValue(filterOpts) {
        return this.properties.reduce((acc, p) => {
            return acc + p.getPropertyValue(filterOpts)
        }, 0) * this.properties.length / this.avgPropertiesCount
        // return 1
    }

    /**
     * 
     * @returns return filtered list of properties belong to this constituency
     */
    getFilteredProperties(filterOpts) {
        // return this.properties
        const {enbloc: {threshold: enblocT}, distToMrt: {threshold: mrtT}, distToSchool: {threshold: schoolT}} = filterOpts
        return this.properties.filter(p => {
            const {enbloc, distToMrt, distToSchool} = p.valueProps
            return enbloc >= enblocT && distToMrt >= mrtT && distToSchool >= schoolT
        })
    }
}

export default Constituency
