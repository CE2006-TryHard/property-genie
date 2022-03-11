import React from 'react'
import Select from 'react-select'
import { dbMgr } from '../../systemMgr/GlobalContext'
import "./SearchBarUI.scss"

export default class SearchBarUI extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reachMinLength: false
    }
  }

  render() {
    return (
      <div className="search-bar-container">
        <div className="search-bar-content">
        <Select
          value={this.props.selectedSearch}
          onChange={this.props.onChange}
          onInputChange={this.onInputChange.bind(this)}
          options={this.state.reachMinLength ? this.formatSearchOptions() : []}
          minLength={2} />
        </div>
      </div>
    )
  }

  onInputChange (input) {
    this.setState({reachMinLength: input.length > 1})
  }

  formatSearchOptions () {
    if (dbMgr.getProperties().length == 0) return []
    return dbMgr.getProperties().map(p => ({label: p.name, value: p.name}))
  }
}
