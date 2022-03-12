import { dbMgr, filterMgr } from "../systemMgr/GlobalContext"

export default class User {
    constructor(name, email, isGoogleAccount) {
        this.email = email
        this.name = name
        this.id = email.split('.')[0]
        this.isGoogleAccount = isGoogleAccount
        this.password = ''
        this.isVerified = false
        this.bookmarks = []
        this.recentSearches = []
        this.filterOptions = []

        // this.fetchUserInfo()
    }

    // fetchUserInfo() {
    //     dbMgr.fetchAllUserData(this.id, userData => {
    //         this.recentSearch = userData.recentSearch || []
    //         this.bookmarks = userData.bookmarks || []
    //         this.filterOptions = userData.filterOptions || {}
    //         filterMgr.updateFilterByActiveUser(this) // only update filter after user info fetched

    //     })
        
    // }

    setIsVerified(val) {
        this.isVerified = this.isGoogleAccount || val
    }

    addBookmarks (newBookmark) {
        if (this.bookmarks.filter(b => b === newBookmark) === 0) {
            this.bookmarks.push(newBookmark)
            dbMgr.updateUserData('bookmark', this.bookmarks)
        } else {
            console.log('bookmark already exists!')
        }
    }

    removeBookmarks(bookmark) {
        if (this.bookmarks.filter(b => b === bookmark) > 0) {
            this.bookmarks = this.bookmarks.filter(b => b !== bookmark)
            dbMgr.updateUserData('bookmark', this.bookmarks)
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

    setFilterOptions (values) {
        this.filterOptions = values
    }
}