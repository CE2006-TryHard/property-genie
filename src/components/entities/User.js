export default class User {
    constructor(name, email, isGoogleAccount) {
        this.email = email
        this.name = name
        this.isGoogleAccount = isGoogleAccount
        this.password = ''
        this.isVerified = false
        this.bookmarks = []
        this.recentResearch = []
        this.filterChoices = []
    }

    setIsVerified(val) {
        this.isVerified = this.isGoogleAccount || val
    }

    setBookmarks (bookmarks) {
        this.bookmarks = this.bookmarks
    }

    setRecentSearch(recentSearches) {
        this.recentResearch = recentSearches
    }

    setFilterChoices (choices) {
        this.filterChoices = choices
    }
}