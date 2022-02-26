import User from '../entities/User'
export default class UserInfoMgr {
    setActiveUser ({name, email}) {
        const newUser = new User(name, email, true)
        newUser.setBookmarks(this.fetchBookmark(name))
        newUser.setRecentSearch(this.fetchRecentSearch(name))
        newUser.setFilterChoices(this.fetchFilterChoices(name))
        return newUser
    }

    // https://stackoverflow.com/questions/48849948/keeping-google-login-persistent-on-reloading-single-page-react-app
    fetchBookmark (name) {
        // TODO: fetch user bookmark from database
        const dummyBookmark = [
            "ABC"
        ]

        return dummyBookmark
    }

    fetchRecentSearch(name) {
        // TODO: fetch user bookmark from database
        const dummySearch = [
            "123 QWE"
        ]

        return dummySearch
    }

    fetchFilterChoices (name) {
        // TODO: fetch user previous choice of filter combination

        const dummyFilter = [
            {id: "distToMRT", label: "Distance to MRT"}
        ]

        return dummyFilter
    }

    updateFilterChoices (name) {
        //TODO: update user latest filter choices to database
    }
}