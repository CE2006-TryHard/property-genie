/**
 * An entity class representing a SearchItem
 */

class SearchItem {
    constructor(type, value) {
        /** @public */
        this.type = type
        /** @public */
        this.value = value
        /** @public */
        this.label = value.name
    }
}

export default SearchItem
