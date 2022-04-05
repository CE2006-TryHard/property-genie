/**
 * A control class manages filter option format
 */
class SidePanelOptMgr {
    constructor () {
        /** @public */
        this.optionItems = {
            loginsignup: {
                label: 'Log in / Register', hide: false, state: 2
            },
            accountinfo: {
                label: 'Account', hide: false, state: 4,
            },
            bookmark: {
                label: 'Bookmarks', hide: false, enable: false, state: 5
            },
            // scoresetting: {
            //     label: 'Score Setting', hide: false, enable: true, state: 10,
            // },
            filter: {
                label: 'Filters', hide: false, enable: true, state: 6
            },
            logout: {
                label: 'Log out', hide: false, enable: false, state: 9
            }
        }
    
    }

    /**
     * 
     * @param {User} activeUser 
     * @returns {Object[]}
     * @description return a list of option items
     */
    getOptionItems (activeUser) {
        this.optionItems['loginsignup'].hide = !!activeUser
        this.optionItems['logout'].hide = !activeUser
        this.optionItems['accountinfo'].hide = !activeUser
        this.optionItems['bookmark'].hide = !activeUser

        return Object.keys(this.optionItems)
            .filter(optKey => !this.optionItems[optKey].hide)
            .map(optKey => this.optionItems[optKey])
    }
}

export default SidePanelOptMgr
