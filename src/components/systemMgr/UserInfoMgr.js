import { dbMgr } from "./GlobalContext"

export default class UserInfoMgr {
    addBookmarks (activeUser, newBookmark) {
        if (this.bookmarks.filter(b => b === newBookmark) === 0) {
            this.bookmarks.push(newBookmark)
            dbMgr.updateUserData(activeUser, 'bookmark', this.bookmarks)
        } else {
            console.log('bookmark already exists!')
        }
    }

    removeBookmarks(activeUser, bookmark) {
        if (this.bookmarks.filter(b => b === bookmark) > 0) {
            this.bookmarks = this.bookmarks.filter(b => b !== bookmark)
            dbMgr.updateUserData('bookmark', this.bookmarks)
        } else {
            console.log('bookmark does not exist from this user record!')
        }
    }

    addRecentSearch(recentSearches, newSearch) {
        recentSearches = recentSearches.filter(s => s !== newSearch)
        recentSearches.unshift(newSearch)
        if (recentSearches.length > 10) recentSearches.splice(10 - recentSearches.length)
        return recentSearches
    }
}