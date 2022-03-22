import { loginActivityMgr } from "./Mgr"

export default class SidePanelOptMgr {
    constructor () {
        this.optionItems = {
            loginsignup: {
                label: 'Login / Register', hide: false, state: 3
            },
            accountinfo: {
                label: 'Account', hide: false, state: 8,
            },
            bookmark: {
                label: 'Bookmarks', hide: false, enable: false, state: 4
            },
            filter: {
                label: 'Filters', hide: false, enable: true, state: 5
            },
            logout: {
                label: 'Logout', hide: false, enable: false, state: 7
            }
        }
    
    }

    getOptionItems (activeUser) {
        this.optionItems['loginsignup'].hide = !!activeUser
        this.optionItems['logout'].hide = !activeUser
        this.optionItems['accountinfo'].hide = !activeUser

        return Object.keys(this.optionItems)
            .filter(optKey => !this.optionItems[optKey].hide)
            .map(optKey => this.optionItems[optKey])
    }
}