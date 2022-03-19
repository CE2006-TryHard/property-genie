export default class User {
    constructor(name, email, isGoogleAccount) {
        this.email = email
        this.name = name
        this.id = email.split('.')[0]
        this.isGoogleAccount = isGoogleAccount
        this.password = ''
        this.isVerified = false
        this.bookmarkStr = []
        this.recentSearchStr = []
        this.filterOptions = []
    }

    setIsVerified(val) {
        this.isVerified = this.isGoogleAccount || val
    }
}