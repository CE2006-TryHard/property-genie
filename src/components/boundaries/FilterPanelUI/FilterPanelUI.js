import "./FilterPanelUI.scss"
import { CheckBox } from "../MiscUI"

/**
 * @namespace FilterPanelUI
 * @description boundary module
 */
const FilterPanelUI = props => {
    const {filterOptions, onFilterChange} = props

    /**
    * @memberof FilterPanelUI
    * @typedef {function} onChange called when user checks/unchecks a filter checkbox.
    * @param {String} key Filter option ID
    * @param {Boolean} value filter option checked value
    */
    const onChange = (key, value) => {
        const newfilterOptions = JSON.parse(JSON.stringify(filterOptions))
        newfilterOptions[key].checked = value
        onFilterChange(newfilterOptions)
    }

    /**
     * @memberof FilterPanelUI
    * @typedef {function} onReset called when user reset(uncheck) all filter checkbox.
    */
    const onReset = () => {
        const newfilterOptions = JSON.parse(JSON.stringify(filterOptions))
        Object.keys(newfilterOptions).forEach(key => {
            newfilterOptions[key].checked = false
        })

        onFilterChange(newfilterOptions)
    }

    return (<div className="filter-panel-container">
        <CheckBox options={filterOptions} onChange={onChange}></CheckBox>
        <button onClick={onReset}>Reset</button>
    </div>)
    
}

export default FilterPanelUI