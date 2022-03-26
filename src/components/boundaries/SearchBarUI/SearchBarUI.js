import {useState} from 'react'
import Select, {components} from 'react-select'
import SearchItem from '../../entities/SearchItem'
import { dbMgr } from '../../controls/Mgr'
import { HomeLogo, SgLogo } from '../MiscUI'
import "./SearchBarUI.scss"

const SearchBarUI = props => {
  const {properties, selectedSearch, recentSearches, onChange} = props
  const [isMinLength, setIsMinLength] = useState(false)

  const onSearchChange = newSearch => {
    onChange(newSearch)
  }

    const onInputChange = input => {
      setIsMinLength(input.length > 1)
    }
  
    const getSearchOptions = () => {
      if (isMinLength) {
        const constituencyObjs = dbMgr.getConstituencies()
        const c = Object.keys(constituencyObjs).map(cName => new SearchItem('c', constituencyObjs[cName]))
        const p = properties.map(p => new SearchItem('p', p))
        return [...c, ...p]
      }
      return recentSearches
    }

    const CustomOption = ({ children, ...props }) => {
      const {type, label} = props.data
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
        <Select components={{Option: CustomOption}}
          value={selectedSearch}
          onChange={onSearchChange}
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
