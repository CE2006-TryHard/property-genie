import { dbMgr } from "./Mgr"

export default class FilterMgr {
    constructor () {
        this.filterOptions = {}
        // this.fetchFilterOptions()
    }

    // fetchFilterOptions () {
    //     dbMgr.fetchFilterData(filterOpts => {
    //         this.filterOptions = filterOpts
    //     })
    // }

    updateFilterByActiveUser (user) {
        Object.keys(this.filterOptions).forEach(key => {
            this.filterOptions[key].checked = user.filterOptions[key]
        })
    }

    getFilterOptions() {
        return this.filterOptions
    }

    updateUserFilterOption (newFilterOptions) {
        this.filterOptions = newFilterOptions
        const userOpt = {}
        Object.keys(newFilterOptions).forEach(key => {
            userOpt[key] = !!newFilterOptions[key].checked
        })
        dbMgr.updateUserData('filterOptions', userOpt)
        // console.log()
    }

    resetUserFilterOption () {
        const userOpt = {}
        Object.keys(this.filterOptions).forEach(key => {
            console.log('check', this.filterOptions)
            this.filterOptions[key].checked = false
            userOpt[key] = false
        })
        dbMgr.updateUserData('filterOptions', userOpt)
    }
}