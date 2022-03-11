import { dbMgr } from "./GlobalContext"

export default class FilterMgr {
    constructor () {
        this.filterOptions = []
        this.fetchFilterOptions()

        // this.fetchUserOptionConfig = 
    }

    fetchFilterOptions () {
        // TODO: fetch filter options from data base
        dbMgr.fetchFilterData(filterOpts => {
            this.filterOptions = Object.keys(filterOpts).map(key => ({id: key, label: filterOpts[key]}))
        })
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