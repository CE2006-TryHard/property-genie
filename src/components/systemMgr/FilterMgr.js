export default class FilterMgr {
    constructor () {
        this.filterOptions = this.fetchFilterOptions()
    }

    fetchFilterOptions () {
        // TODO: fetch filter options from data base
        // assign to filterOptions
        const dummyFilter = [
            {id: "enbloc", label:"En Bloc"},
            {id: "distToMRT", label: "Distance to MRT"},
            {id: "distToSchool", label: "Distance to School"}
        ]

        return dummyFilter
    }
}