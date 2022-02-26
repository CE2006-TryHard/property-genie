import React from 'react'
import Select from 'react-select'
import { dbMgr } from '../../systemMgr/GlobalContext'
import "./SearchBarUI.scss"

export default class SearchBarUI extends React.Component {
  render() {
    return (
      <div className="search-bar-container">
        <div className="search-bar-content">
        <Select
          value={this.props.selectedSearch}
          onChange={this.props.onChange}
          options={this.formatSearchOptions()} />
        </div>
      </div>
    )
  }

  formatSearchOptions () {
    return dbMgr.getProperties().map(p => ({label: p.name, value: p.name}))
  }
}
