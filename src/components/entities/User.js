/**
 * An entity class representing a User
 */
class User {
    constructor(name, email, registerViaGoogle) {
        /** @public */
        this.email = email
        /** @public */
        this.name = name
        /** @public */
        this.id = email.split('.')[0]
        /** @public */
        this.registerViaGoogle = registerViaGoogle
        /** @public */
        this.password = ''
        /** @public */
        this.isVerified = false
        /** @public */
        this.bookmarks = []
        /** @public */
        this.recentSearches = []
    }
    /**
     * @param {Boolean} val set if user is verified
     */
    setIsVerified(val) {
        this.isVerified = this.registerViaGoogle || val
    }
}

export default User
