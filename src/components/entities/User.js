

/**
 * An entity class representing a User
 */
class User {
    constructor(name, email, isGoogleAuth) {
        /** @public */
        this.email = email
        /** @public */
        this.name = name
        /** @public */
        this.id = this.setUserIDByEmail(email, isGoogleAuth)
        /** @public */
        this.password = ''
        /** @public */
        this.isVerified = false
        /** @public */
        this.isGoogleAuth = isGoogleAuth
        /** @public */
        this.bookmarks = []
        /** @public */
        this.recentSearches = []
    }

    setUserIDByEmail(email, isGoogleAuth) {
        return (isGoogleAuth ? 'google-' : '') + email.replace('.', '-')
    }
}

export default User
