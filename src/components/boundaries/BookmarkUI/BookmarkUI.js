import { useState } from "react"
import './BookmarkUI.scss'
import InfoPanelUI from "../InfoPanelUI/InfoPanelUI"

const BookmarkUI = props => {
    const {bookmarks, filterOptions, onBookmarkRemove, onBookmarkRemoveAll} = props
    const [bookmarksToBeRemoved, setBookmarksToBeRemoved] = useState([])
    const [viewedProperty, setViewProperty] = useState(null)

    const onViewPropertyDetail = property => {
        setViewProperty(property)
    }

    const onClosePropertyDetail = () => {
        setViewProperty(null)
    }

    const onVerifyRemoveBookmark = property => {
        setBookmarksToBeRemoved([property])
    }

    const onVerifyRemoveAllBookmarks = () => {
        setBookmarksToBeRemoved(bookmarks)
    }

    const onConfirmRemoveBookmark = () => {
        if (bookmarksToBeRemoved.length === 1) {
            onBookmarkRemove(bookmarksToBeRemoved[0], false)
        } else {
            onBookmarkRemoveAll()
        }
        setBookmarksToBeRemoved([])
    }


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
                    :   <p>Are you sure you want to delete <b>ALL bookmark(s)</b>?</p>}
                    
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
