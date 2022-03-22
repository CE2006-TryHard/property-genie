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
    const {name, address, school, mrt, avgMrtDist, avgSchoolDist, enblocRank} = this.props.property
    const schoolStr = Object.keys(school).reduce((acc, schoolName,i) => {
      acc += schoolName
      if (i < Object.keys(school).length - 1) acc += ', '
      return acc
    }, "")

    const mrtStr = Object.keys(mrt).reduce((acc, mrtName, i) => {
      acc += mrtName
      if (i < Object.keys(mrt).length - 1) acc += ', '
      return acc
    }, "")
    const generalView = () => {
      return (
        <div className="info-panel-detail-content general">
          <div className="profile-image-container">
            <img src=""/>
          </div>
          <div className="right">
            <h3>{name}</h3>
            <p className="address">{address}</p>
            <p className="school"><b>School(s) nearby:</b><br/>{schoolStr}</p>
            <p className="mrt"><b>Nearest MRTs:</b><br/>{mrtStr}</p>
            <p className="enbloc"><b>En Bloc value:</b><br/>{enblocRank}</p>
            <p></p>
          </div>
        </div>
      )
    }

    const valueView = () => {
      return (
        <div className="info-panel-detail-content value">
          <p>En Bloc: {enblocRank}</p>
          <p>Average distance to MRT: {avgMrtDist}km</p>
          <p>Average distance to School: {avgSchoolDist}km</p>
        </div>
      )
    }

    
  
    return (<div className="info-panel-container">
      <div className="info-panel-content">
        <TabButton options={views} current={this.state.currentView} onChange={this.onViewChange.bind(this)}></TabButton>
        <div className="info-panel-detail-container">
          {this.props.enableBookmark && this.state.currentView === 'General' ? 
          <div className="bookmark-button-wrapper" onClick={this.onBookmarkClick.bind(this)}>
             <div className={`bookmark-button ${this.props.isBookmarked ? 'checked' : ''}`}></div>
          </div>
          : ''}
          
          {this.state.currentView === 'General' ? generalView() : valueView()}
        </div>
        
      </div>
        
        
    </div>)
  }
}