

/**
 * An entity class representing a User
 */
class User {
    constructor(name, email, loginViaGoogle) {
        /** @public */
        this.email = email
        /** @public */
        this.name = name
        /** @public */
        this.id = this.setUserIDByEmail(email, loginViaGoogle)
        /** @public */
        // this.registerViaGoogle = registerViaGoogle
        this.loginViaGoogle = loginViaGoogle
        /** @public */
        this.password = ''
        /** @public */
        this.isVerified = false
        /** @public */
        this.bookmarks = []
        /** @public */
        this.recentSearches = []
    }

    setUserIDByEmail(email, loginViaGoogle) {
        return (loginViaGoogle ? 'google-' : '') + email.replace('.', '-')
    }
}

export default User
