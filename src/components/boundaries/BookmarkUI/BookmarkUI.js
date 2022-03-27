import { useState } from "react"
import './BookmarkUI.scss'
import InfoPanelUI from "../InfoPanelUI/InfoPanelUI"

/**
 * @namespace BookmarkUI
 * @description boundary module
 * @property {Property[]} bookmarksToBeRemoved properties to be removed from bookmark list.
 * @property {Property} viewedProperty value to toggle the email text field
 */
const BookmarkUI = props => {
    const { bookmarks, filterOptions, onBookmarkRemove, onBookmarkRemoveAll } = props
    const [bookmarksToBeRemoved, setBookmarksToBeRemoved] = useState([])
    const [viewedProperty, setViewProperty] = useState(null)

    /**
     * @memberof BookmarkUI
    * @typedef {function} onViewPropertyDetail called when user click on one of the property on bookmark panel
    * @param {Property} property property to be viewed
    */
    const onViewPropertyDetail = property => {
        setViewProperty(property)
    }

    /**
     * @memberof BookmarkUI
     * @typedef {function} onClosePropertyDetail called when user click on "back" button to return to bookmark panel.
     */
    const onClosePropertyDetail = () => {
        setViewProperty(null)
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onVerifyRemoveBookmark called when user click on one of the bookmark's "Remove" button.
    * @param {Property} property property to be removed
    */
    const onVerifyRemoveBookmark = property => {
        setBookmarksToBeRemoved([property])
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onVerifyRemoveAllBookmarks called when user click on "Remove all bookmark(s)" button.
    * @param {Property} property property to be removed
    */
    const onVerifyRemoveAllBookmarks = () => {
        setBookmarksToBeRemoved(bookmarks)
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onConfirmRemoveBookmark called when user click on "Confirm" button to execute bookmark removal.
    */
    const onConfirmRemoveBookmark = () => {
        if (bookmarksToBeRemoved.length === 1) {
            onBookmarkRemove(bookmarksToBeRemoved[0], false)
        } else {
            onBookmarkRemoveAll()
        }
        setBookmarksToBeRemoved([])
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onCancelRemoveBookmark called when user click on "Cancel" button to revoke bookmark removal.
    */
    const onCancelRemoveBookmark = () => {
        setBookmarksToBeRemoved([])
    }

    return (<div className="bookmark-container">
        <div className="bookmark-content">
            {bookmarks.length ? <button className="remove-all-bookmark-button" onClick={onVerifyRemoveAllBookmarks}>Remove all bookmark(s)</button> : ""}
            {bookmarks.length ?
                bookmarks.map((b, i) => <div className="bookmark-item" key={i}>
                    <div className="profile-image-container">
                        <img />
                    </div>
                    <div className="bookmark-item-info">
                        <h3>{b.name}</h3>
                        <button className="view-detail-button" onClick={() => onViewPropertyDetail(b)}>View property detail</button>
                        <span className="text-button" onClick={() => onVerifyRemoveBookmark(b)}>Remove</span>
                    </div>

                </div>)
                : "You have not added any bookmark."}
        </div>
        {viewedProperty ?
            <div className="property-detail-container">
                <InfoPanelUI
                    property={viewedProperty}
                    filterOptions={filterOptions}
                    enableBookmark={false}></InfoPanelUI>
                <button className="back-button" onClick={onClosePropertyDetail}>Back to bookmark panel</button>
            </div>
            : ""}

        {bookmarksToBeRemoved.length ?
            <div className="confirm-message-container">
                <div className="confirm-message-content">
                    {bookmarksToBeRemoved.length === 1 ?
                        <p>Are you sure you want to delete bookmark "<b>{bookmarksToBeRemoved[0].name}</b>"?</p>
                        : <p>Are you sure you want to delete <b>ALL bookmark(s)</b>?</p>}

                    <div>
                        <button onClick={onConfirmRemoveBookmark}>Confirm</button>
                        <button onClick={onCancelRemoveBookmark}>Cancel</button>
                    </div>
                </div>
            </div>
            : ""}

    </div>)
}

export default BookmarkUI
