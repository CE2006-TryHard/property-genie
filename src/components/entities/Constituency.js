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
}

export default Constituency