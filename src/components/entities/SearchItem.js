export default class SearchItem {
    constructor(type, value) {
        this.type = type
        this.value = value
        this.name = value.name
        this.label = value.name
    }
}