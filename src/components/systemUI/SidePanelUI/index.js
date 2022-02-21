import React, {useState} from 'react'
import "./SidePanelUI.scss"
import SidePanelButton from './SidePanelButton'

class SidePanelUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: ""}
  }

  render () {

    return (
      <div className="side-panel-entry">
        <SidePanelButton onClick={this.onMenuButtonClick.bind(this)}></SidePanelButton>
        <div className={`side-panel-container ${this.state.isOpen}`}>
          <div className="side-panel-content">
            {this.props.sidePanelOptMgr.getOptionItems().map((opt, i) => 
              <div className="side-panel-option" key={i}
                onClick={() => this.onOptionSelect(opt.state)}>{opt.label}</div>)
            }
          </div>
          <div className="close-region" onClick={this.onClose.bind(this)}></div>
        </div>
      </div>
    )
  }

  onMenuButtonClick () {
    this.setState({isOpen: this.state.isOpen === "" ? "open" : ""})
  }

  onOptionSelect(stateIndex) {
    this.props.onOptionSelect(stateIndex)
    this.onClose()
  }

  onClose() {
    this.setState({isOpen: ""})
  }

}

export default SidePanelUI
