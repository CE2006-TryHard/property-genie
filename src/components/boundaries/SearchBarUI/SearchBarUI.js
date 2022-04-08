import "./SearchBarUI.scss"
import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import { selectProperty, selectConstituency, setPageState } from '../../../features'

import Select, { components } from 'react-select'
import {SearchItem} from '../../entities'
import { dbMgr } from '../../controls/Mgr'
import { HomeLogo, SgLogo } from './../MiscUI/MiscUI'
import { CONSTITUENCY_NAME } from '../../CONFIG'


const addRecentSearch = (recentSearch, newSearch) => {
  recentSearch = recentSearch.filter(rs => rs.value.id !== newSearch.value.id)
  recentSearch.unshift(newSearch)
  if (recentSearch.length > 10) recentSearch.splice(10 - recentSearch.length)
  return recentSearch
}

/**
 * @namespace SearchBarUI
 * @description boundary module
 * @property {Boolean} isMinLength value to determine if user input exceed minimum required length
 */
const SearchBarUI = props => {
  const dispatch = useDispatch()
  const { activeUser } = props
  const [isMinLength, setIsMinLength] = useState(false)
  const [currentSearch, setCurrentSearch] = useState(null)
  const [recentSearches, setRecentSearches] = useState([])

  /**
   * @memberof SearchBarUI
   * @typedef {function} onChange called when user executes search
   * @param {SearchItem} newSearch new search
   */
  const onChange = newSearch => {
    const {type, value} = newSearch
    if (type === 'c') {
      dispatch(selectConstituency(value))
      dispatch(setPageState(0))
    }
    else if (type === 'p') {
      dispatch(selectProperty(value))
      dispatch(setPageState(7))
    }
    setCurrentSearch(newSearch)

    let tempSearches = [...recentSearches]
    tempSearches = addRecentSearch(tempSearches, newSearch)
    setRecentSearches(tempSearches)
    
    tempSearches = tempSearches.map(cs => {
      return {type: cs.type, id: cs.value.id}
    })

    dbMgr.updateUserDataDB(activeUser, 'recentSearches', tempSearches)
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

  useEffect(() => {
    if (activeUser) {
      // update recent search
      const ccs =dbMgr.getConstituencies()
      const pps = dbMgr.getProperties()
      let tempSearches = activeUser.recentSearches
        .map(({type, id}) => {
          const searchObj = type === 'c' ? ccs[CONSTITUENCY_NAME[id].name] : pps.filter(p => p.id === id)[0]
          return new SearchItem(type, searchObj)
        })
        
      // const localRecentSearches = [...recentSearches]
      // while (localRecentSearches.length > 0) {
      //   tempSearches = addRecentSearch(tempSearches, localRecentSearches.pop())
      // }
      setRecentSearches(tempSearches)
      // dbMgr.updateUserDataDB(activeUser, 'recentSearches', tempSearches.map(s => ({type: s.type, id: s.value.id})))

    }
  }, [activeUser])

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
          value={currentSearch}
          isSearchable={true}
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
