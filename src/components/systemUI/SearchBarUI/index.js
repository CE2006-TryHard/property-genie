import React from 'react'
import Select from 'react-select'
import "./SearchBarUI.scss"

export default class SearchBarUI extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reachMinLength: false
    }
  }

  onSearchChange(newSelection) {
    this.props.onChange(newSelection)
  }

  render() {
    return (
      <div className="search-bar-container">
        <div className="search-bar-content">
        <Select
          value={this.props.selectedSearch}
          onChange={this.onSearchChange.bind(this)}
          onInputChange={this.onInputChange.bind(this)}
          options={this.getSearchOptions()} />
        </div>
      </div>
    )
  }

  onInputChange (input) {
    this.setState({reachMinLength: input.length > 1})
  }

  getSearchOptions () {
    if (this.state.reachMinLength) return this.props.properties
    return this.props.recentSearches
  }
}
