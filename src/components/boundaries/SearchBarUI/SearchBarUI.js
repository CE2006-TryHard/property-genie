import { useState } from 'react'
import Select, { components } from 'react-select'
import {SearchItem} from '../../entities/index'
import { dbMgr } from '../../controls/Mgr'
import { HomeLogo, SgLogo } from './../MiscUI/MiscUI'
import "./SearchBarUI.scss"

/**
 * @namespace SearchBarUI
 * @description boundary module
 * @property {Boolean} isMinLength value to determine if user input exceed minimum required length
 */
const SearchBarUI = props => {
  const { selectedSearch, recentSearches, onSearchChange } = props
  const [isMinLength, setIsMinLength] = useState(false)

  /**
   * @memberof SearchBarUI
   * @typedef {function} onChange called when user executes search
   * @param {SearchItem} newSearch new search
   */
  const onChange = newSearch => {
    onSearchChange(newSearch)
  }

  /**
   * @memberof SearchBarUI
   * @typedef {function} onInputChange called when user enters character in input field
   * @param {String} input current input
   */
  const onInputChange = input => {
    setIsMinLength(input.length > 1)
  }

  /**
   * @memberof SearchBarUI
   * @typedef {function} getSearchOptions called when user executes search
   * @return {SearchItem} a list of SearchItem
   */
  const getSearchOptions = () => {
    if (isMinLength) {
      const constituencyObjs = dbMgr.getConstituencies()
      const properties = dbMgr.getProperties()
      const c = Object.keys(constituencyObjs).map(cName => new SearchItem('c', constituencyObjs[cName]))
      const p = properties.map(p => new SearchItem('p', p))
      return [...c, ...p]
    }
    return recentSearches
  }

  /**
   * @memberof SearchBarUI
   * @typedef {function} CustomOption FunctionalComponent rendering custom option item in search result
   * @param {Object}
   */
  const CustomOption = ({ children, ...props }) => {
    const { type, label } = props.data
    return (
      <components.Option {...props} className="custom-option">
        {type === 'p' ?
          <HomeLogo className="option-logo" width="20px" height="20px"></HomeLogo> :
          <SgLogo className="option-logo" width="20px" height="20px"></SgLogo>}
        {label}
      </components.Option>
    );
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-content">
        <Select components={{ Option: CustomOption }}
          value={selectedSearch}
          onChange={onChange}
          onInputChange={onInputChange}
          options={getSearchOptions()}
          theme={theme => ({
            ...theme,
            spacing: {
              ...theme.spacing,
              controlHeight: 35,
              baseUnit: 0,
            }
          })}
        />
      </div>
    </div>
  )
}

export default SearchBarUI
