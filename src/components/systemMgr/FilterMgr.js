export default class FilterMgr {
    constructor () {
        const filterOptObj = {}
        // this.filterOptions = this.fetchFilterOptions().forEach(opt => {
        //     filterOptObj[opt.label] = false
        // })

        this.filterOptions = this.fetchFilterOptions()

        // this.fetchUserOptionConfig = 
    }

    fetchFilterOptions () {
        // TODO: fetch filter options from data base
        // assign to filterOptions
        return [
            {id: "enbloc", label:"En Bloc"},
            {id: "distToMRT", label: "Distance to MRT"},
            {id: "distToSchool", label: "Distance to School"}
        ]
    }

    getFilterOptions() {
        return this.filterOptions
    }

    updateUserFilterOption () {
        console.log()
    }

    resetUserFilterOption () {
        console.log()
    }
}