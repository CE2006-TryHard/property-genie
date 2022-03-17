
export default class Property {
    constructor (props) {
        const {name, description, price_range, lat, lng, enbloc, distToMrt, distToSchool} = props
        this.name = name
        this.label = name
        this.description = description
        this.price_range = price_range
        this.lat = lat
        this.lng = lng
        this.enbloc = enbloc
        this.distToMrt = distToMrt
        this.distToSchool = distToSchool
    }
}