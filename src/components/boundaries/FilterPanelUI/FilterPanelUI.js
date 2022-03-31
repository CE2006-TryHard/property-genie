import "./FilterPanelUI.scss"
import { CheckBox, Slider } from "../MiscUI"

/**
 * @namespace FilterPanelUI
 * @description boundary module
 */
const FilterPanelUI = props => {
    const {filterOptions, onFilterChange} = props

    /**
    * @memberof FilterPanelUI
    * @typedef {function} onCheckboxChange called when user checks/unchecks a filter checkbox.
    * @param {String} key Filter option ID
    * @param {Boolean} value filter option "checked" value
    */
    const onCheckboxChange = (key, value) => {
        const newfilterOptions = JSON.parse(JSON.stringify(filterOptions))
        newfilterOptions[key].checked = value
        onFilterChange(newfilterOptions)
    }

    /**
     * @typedef {function} onSubmitSliderChange called when user finish changing slider value.
     * @param {String} key Filter option ID 
     * @param {Number} value filter option "threshold" value 
     */
    const onSubmitSliderChange = (key, value) => {
        let newFilterOptions = JSON.parse(JSON.stringify(filterOptions))
        newFilterOptions[key].threshold = value
        onFilterChange(newFilterOptions)
    }

    /**
     * @memberof FilterPanelUI
    * @typedef {function} onReset called when user reset(uncheck) all filter checkbox.
    */
    const onReset = () => {
        const newFilterOptions = JSON.parse(JSON.stringify(filterOptions))
        Object.keys(newFilterOptions).forEach(key => {
            newFilterOptions[key].checked = false
            newFilterOptions[key].threshold = 0
        })
        onFilterChange(newFilterOptions)
    }

    return (<div className="filter-panel-container">
        <div className="filter-section">
            <h5>Only display properties that meet below values</h5>
            {Object.keys(filterOptions).map((fOptKey, i) => (
                <Slider key={i} title={filterOptions[fOptKey].label} min={0} max={1} step={0.1} 
                initialVal={filterOptions[fOptKey].threshold}
                onAfterChange={val => onSubmitSliderChange(fOptKey, val)}></Slider>
            ))}
        </div>
        <div className="value-section">
            <h5>What to be considered when calculating the value of property</h5>
            <CheckBox options={filterOptions} onChange={onCheckboxChange}></CheckBox>
        </div>
        <button onClick={onReset}>Reset</button>
    </div>)
    
}

export default FilterPanelUI