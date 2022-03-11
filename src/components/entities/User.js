import { dbMgr } from "../systemMgr/GlobalContext"

export default class User {
    constructor(name, email, isGoogleAccount) {
        this.email = email
        this.name = name
        this.isGoogleAccount = isGoogleAccount
        this.password = ''
        this.isVerified = false
        this.bookmarks = []
        this.recentSearches = []
        this.filterChoices = []
    }

    fetchUserInfo() {
        dbMgr.fetchUserData(this.name, userData => {
            this.recentSearch = userData.recentSearch || []
            this.bookmarks = userData.bookmarks || []
        })
    }

    setIsVerified(val) {
        this.isVerified = this.isGoogleAccount || val
    }

    addBookmarks (newBookmark) {
        if (this.bookmarks.filter(b => b === newBookmark) === 0) {
            this.bookmarks.push(newBookmark)
            dbMgr.updateUserData(this.email, 'bookmark', this.bookmarks)
        } else {
            console.log('bookmark already exists!')
        }
    }

    removeBookmarks(bookmark) {
        if (this.bookmarks.filter(b => b === bookmark) > 0) {
            this.bookmarks = this.bookmarks.filter(b => b !== bookmark)
            dbMgr.updateUserData(this.email, 'bookmark', this.bookmarks)
        } else {
            console.log('bookmark does not exist from this user record!')
        }
    }

    addRecentSearch(newSearch) {
        if (this.recentSearches.filter(s => s === newSearch) > 0) {
            this.recentSearches = this.recentSearches.filter(s => s !== newSearch)
        }
        this.recentSearches.unshift(newSearch)
    }

    setFilterChoices (choices) {
        this.filterChoices = choices
    }
}