import React from 'react'
import Select from 'react-select'
import { dbMgr } from '../../systemMgr/GlobalContext'
import "./SearchBarUI.scss"

export default class SearchBarUI extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      reachMinLength: false,
      // recentSearches: (dbMgr.activeUser && dbMgr.activeUser.recentSearches) || []
    }
  }

  onSearchChange(newSelection) {
    // let curSearches = this.props.recentSearches
    // curSearches = curSearches.filter(s => s !== newSelection.value)
    // if (curSearches.length === 10) curSearches.pop()
    
    // curSearches.unshift(newSelection.value)
    // this.setState({...this.state, recentSearches: curSearches})
    // dbMgr.updateUserData('recentSearches', curSearches)
    this.props.onChange(newSelection.value)
  }

  render() {
    const selectedVal = {label: this.props.selectedSearch, value: this.props.selectedSearch}
    return (
      <div className="search-bar-container">
        <div className="search-bar-content">
        <Select
          value={selectedVal}
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
    if (this.state.reachMinLength) {
      if (dbMgr.getProperties().length == 0) return []
      return dbMgr.getProperties().map(p => ({label: p.name, value: p.name}))
    }
    
    return this.props.recentSearches.map(s => ({label: s, value: s}))
    
    
  }
}
