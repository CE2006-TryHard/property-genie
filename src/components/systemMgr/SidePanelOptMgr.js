export default class SidePanelOptMgr {
    constructor () {
        this.optionItems = [
            {id: 'loginsignup', label: 'Login / Sign Up', hide: false, state: 3},
            {id: 'bookmark', label: 'Bookmarks', hide: false, enable: false, state: 4},
            {id: 'filter', label: 'Filters', hide: false, enable: true, state: 5},
            {id: 'logout', label: 'Logout', hide: true, enable: false, state: 0}
        ]
    }

    getOptionItems () {
        
        return this.optionItems
    }
}