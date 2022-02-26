import "./InfoPanelUI.scss"
import TabButton from "./TabButton"
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

  render () {
    return (<div className="info-panel-container">
      <div className="info-panel-content">
        <TabButton options={views} current={this.state.currentView} onChange={this.onViewChange.bind(this)}></TabButton>
        <div className="info-panel-detail-container">
          <div className="info-panel-detail-content">
            
          </div>
        </div>
      </div>
        
        
    </div>)
  }
}