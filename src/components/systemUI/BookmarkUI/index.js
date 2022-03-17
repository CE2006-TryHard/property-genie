import React from "react"
import './BookmarkUI.scss'

export default class BookmarkUI extends React.Component {
    render () {
        return (<div className="bookmark-container">
            <div className="bookmark-content">
                {this.props.bookmarks.length ?
                    this.props.bookmarks.map((b, i) => <div className="bookmark-item" key={i}>
                        {b.name}
                    </div>)
                : "You don't have any bookmark."}
            </div>
            
        </div>)
    }
}