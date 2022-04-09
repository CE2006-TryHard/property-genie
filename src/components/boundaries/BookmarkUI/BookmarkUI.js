import './BookmarkUI.scss'
import { useState } from "react"
import {useSelector, useDispatch} from 'react-redux'

import { removeBookmark, removeAllBookmarks, setPageState, selectProperty } from "../../../features"

/**
 * @namespace BookmarkUI
 * @description boundary module
 * @property {Property[]} bookmarkToBeRemoved a property to be removed from bookmark list.
 * @property {Boolean} removeAllBookmarks a boolean value to determine if all bookmarks are to be removed
 */
const BookmarkUI = props => {
    const dispatch = useDispatch()
    const bookmarks = useSelector(state => state.bookmarks)
    const {activeUser} = props
    const [bookmarkToBeRemoved, setBookmarkToBeRemoved] = useState(null)
    const [removeAll, setRemoveAll] = useState(false)

    /**
     * @memberof BookmarkUI
    * @typedef {function} onViewPropertyDetail called when user click on one of the property on bookmark panel
    * @param {Property} property property to be viewed
    */
    const onViewPropertyDetail = property => {
        dispatch(selectProperty(property))
        dispatch(setPageState(7))
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onVerifyRemoveBookmark called when user click on one of the bookmark's "Remove" button.
    * @param {Property} property property to be removed
    */
    const onVerifyRemoveBookmark = property => {
        setBookmarkToBeRemoved(property)
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onVerifyRemoveAllBookmarks called when user click on "Remove all bookmark(s)" button.
    * @param {Property} property property to be removed
    */
    const onVerifyRemoveAllBookmarks = () => {
        setRemoveAll(true)
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onConfirmRemoveBookmark called when user click on "Confirm" button to execute bookmark removal.
    */
    const onConfirmRemoveBookmark = () => {
        dispatch(removeBookmark({activeUser, property: bookmarkToBeRemoved}))
        setBookmarkToBeRemoved(null)
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onConfirmRemoveAllBookmarks called when user click on "Confirm" button to execute all bookmarks removal.
    */
    const onConfirmRemoveAllBookmarks = () => {
        dispatch(removeAllBookmarks({activeUser}))
        setRemoveAll(false)
    }

    /**
     * @memberof BookmarkUI
    * @typedef {function} onCancelRemoveBookmark called when user click on "Cancel" button to revoke bookmark removal.
    */
    const onCancelRemoveBookmark = () => {
        setBookmarkToBeRemoved(null)
        setRemoveAll(false)
    }

    return (
    <div className="bookmark-container">
        {bookmarks.length ? <div className="remove-all-bookmark-button" >
            <span className="text-button text-button-remove" onClick={onVerifyRemoveAllBookmarks}>Remove all bookmark(s)</span></div> : ""}
        <div className="bookmark-content">
            {bookmarks.length ?
                bookmarks.map((b, i) => <div className="bookmark-item" key={i}>
                    <div className="profile-image-container">
                        <img src={b.img} />
                    </div>
                    <div className="bookmark-item-info">
                        <h3>{b.name}</h3>
                        <div className="view-detail-button" onClick={() => onViewPropertyDetail(b)}>View detail</div>
                        <span className="text-button text-button-remove" onClick={() => onVerifyRemoveBookmark(b)}>Remove</span>
                    </div>
                    {bookmarkToBeRemoved && bookmarkToBeRemoved.name === b.name ?
                        <div className="remove-bookmark-item-overlay">
                            <p>Are you sure you want to delete bookmark "<b>{b.name}</b>"?</p>
                            <div>
                                <div className="confirm-button" onClick={onConfirmRemoveBookmark}>Confirm</div>
                                <div className="cancel-button" onClick={onCancelRemoveBookmark}>Cancel</div>
                            </div>
                        </div>
                    : ''}

                </div>)
                : <div className="no-bookmark-msg">You have not added any bookmark.</div>}
        </div>

        {removeAll ?
            <div className="remove-bookmark-all-container">
                <div className="remove-bookmark-all-content">
                    <p>Are you sure you want to delete <b>ALL bookmark(s)</b>?</p>
                    <div>
                        <div className="confirm-button" onClick={onConfirmRemoveAllBookmarks}>Confirm</div>
                        <div className="cancel-button" onClick={onCancelRemoveBookmark}>Cancel</div>
                    </div>
                </div>
            </div>
            : ""}

    </div>
    )
}

export default BookmarkUI
