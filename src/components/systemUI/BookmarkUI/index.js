import React from "react"
import './BookmarkUI.scss'
import InfoPanelUI from "../InfoPanelUI"

export default class BookmarkUI extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bookmarksToBeRemoved: [],
            viewedProperty: null
        }
    }

    render () {
        const {bookmarksToBeRemoved, viewedProperty} = this.state
        return (<div className="bookmark-container">
            <div className="bookmark-content">
                {this.props.bookmarks.length ? <button className="remove-all-bookmark-button" onClick={this.onVerifyRemoveAllBookmarks.bind(this)}>Remove all bookmark(s)</button> : ""}
                {this.props.bookmarks.length ?
                    this.props.bookmarks.map((b, i) => <div className="bookmark-item" key={i}>
                        <div className="profile-image-container">
                            <img />
                        </div>
                        <div className="bookmark-item-info">
                            <h3>{b.name}</h3>
                            <button className="view-detail-button" onClick={() => this.onViewPropertyDetail(b)}>View property detail</button>
                            <span className="text-button" onClick={() => this.onVerifyRemoveBookmark(b)}>Remove</span>
                        </div>
                        
                    </div>)
                : "You have not added any bookmark."}
            </div>
            {viewedProperty ?
                <div className="property-detail-container">
                    <InfoPanelUI property={viewedProperty} enableBookmark={false}></InfoPanelUI>
                    <button className="back-button" onClick={this.onClosePropertyDetail.bind(this)}>Back to bookmark panel</button>
                </div>
            : ""}
            
            {bookmarksToBeRemoved.length ? 
                <div className="confirm-message-container">
                    <div className="confirm-message-content">
                        {bookmarksToBeRemoved.length === 1 ? 
                            <p>Are you sure you want to delete bookmark "<b>{bookmarksToBeRemoved[0].name}</b>"?</p>
                        :   <p>Are you sure you want to delete <b>ALL bookmark(s)</b>?</p>}
                        
                        <div>
                            <button onClick={this.onConfirmRemoveBookmark.bind(this)}>Confirm</button>
                            <button onClick={this.onCancelRemoveBookmark.bind(this)}>Cancel</button>
                        </div>
                    </div>
                </div>
            : ""}
            
        </div>)
    }

    onViewPropertyDetail (property) {
        this.setState({...this.state, viewedProperty: property})
    }

    onClosePropertyDetail () {
        this.setState({...this.state, viewedProperty: null})
    }

    onVerifyRemoveBookmark (property) {
        this.setState({...this.state, bookmarksToBeRemoved: [property]})
    }

    onVerifyRemoveAllBookmarks() {
        this.setState({...this.state, bookmarksToBeRemoved: this.props.bookmarks})
    }

    onConfirmRemoveBookmark() {
        if (this.state.bookmarksToBeRemoved.length === 1) {
            this.props.onBookmarkRemove(this.state.bookmarksToBeRemoved[0], false)
        } else {
            this.props.onBookmarkRemoveAll()
        }
        
        this.setState({...this.state, bookmarksToBeRemoved: []})
    }


    onCancelRemoveBookmark() {
        this.setState({...this.state, bookmarksToBeRemoved: []})
    }
}