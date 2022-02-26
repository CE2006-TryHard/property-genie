import { loginActivityMgr } from "./GlobalContext"

export default class SidePanelOptMgr {
    constructor () {
        this.optionItems = {
            loginsignup: {
                label: 'Login / Sign Up', hide: false, state: 3
            },
            bookmark: {
                label: 'Bookmarks', hide: false, enable: false, state: 4
            },
            filter: {
                label: 'Filters', hide: false, enable: true, state: 5
            }
        }
    
    }

    getOptionItems (activeUser) {
        this.optionItems['loginsignup'].hide = !!activeUser

        return Object.keys(this.optionItems)
            .filter(optKey => !this.optionItems[optKey].hide)
            .map(optKey => this.optionItems[optKey])
    }
}