export default class User {
    constructor(name, email, registerViaGoogle) {
        this.email = email
        this.name = name
        this.id = email.split('.')[0]
        this.registerViaGoogle = registerViaGoogle
        this.password = ''
        this.isVerified = false
        this.bookmarkStr = []
        this.recentSearchStr = []
        // this.filterOptions = []
    }

    setIsVerified(val) {
        this.isVerified = this.registerViaGoogle || val
    }
}