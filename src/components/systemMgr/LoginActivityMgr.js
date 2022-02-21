export default class LoginActivityMgr {
    constructor() {
        this.activeUser = null
    }

    hasLoggedInUser () {
        return this.activeUser != null
    }
}