import "./InfoPanelUI.scss"
import TabButton from "./TabButton"
import { dbMgr } from "../../systemMgr/Mgr"
import React from 'react'

const views = ["General", "Evaluation"]
export default class InfoPanelUI extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: 'General'
    }
  }

  onViewChange (newView) {
    this.setState({currentView: newView})
  }

  onBookmarkClick () {
    this.props.onBookmark(this.props.property, !this.props.isBookmarked)
    // console.log('is book mark?', isBookmarked)
  }

  render () {
    const {name, address} = this.props.property

    const generalView = () => {
      return (
        <div className="info-panel-detail-content general">
          <img src=""/>
          <p>{name}</p>
          <p>{address}</p>
        </div>
      )
    }

    const valueView = () => {
      return (
        <div className="info-panel-detail-content value">
          value
        </div>
      )
    }

    
  
    return (<div className="info-panel-container">
      <div className="info-panel-content">
        <TabButton options={views} current={this.state.currentView} onChange={this.onViewChange.bind(this)}></TabButton>
        <div className="info-panel-detail-container">
          {this.props.enableBookmark ? 
          <div onClick={this.onBookmarkClick.bind(this)} className={`bookmark-button ${this.props.isBookmarked ? 'checked' : ''}`}></div>
          : ''}
          
          {this.state.currentView === 'General' ? generalView() : valueView()}
        </div>
        
      </div>
        
        
    </div>)
  }
}