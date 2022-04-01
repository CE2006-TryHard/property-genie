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
            newFilterOptions[key].checked = key === 'enbloc' 
            newFilterOptions[key].threshold = key === 'enbloc' ? 0 : 2
        })
        onFilterChange(newFilterOptions)
    }

    const filterOptionFormat = [
        {
            key: 'enbloc',
            label: 'Enbloc value lies within range',
            min: 0,
            max: 1,
            step: 0.25,
            tickLabels: ['<20%', '20%-39%', '40%-59%', '60%-79%', '>80%']
        },
        {
            key: 'distToMrt',
            label: 'Distance to MRT lesser than',
            min: 0.2,
            max: 2,
            step: 0.1,
            autoLabel: true,
            unit: 'km',
            tickLabels: ['0.2km', '2km']
        },
        {
            key: 'distToSchool',
            label: 'Distance to School lesser than',
            min: 0.2,
            max: 2,
            step: 0.1,
            autoLabel: true,
            unit: 'km',
            tickLabels: ['0.2km', '2km']
        }
    ]
    return (<div className="filter-panel-container">
        <div className="filter-section">
            <h5>Only display properties that meet below values</h5>
            {filterOptionFormat.map(({key,label, min, max, step, autoLabel, unit, tickLabels}) => (
                <Slider key={key} title={label} min={min} max={max} step={step}
                tickLabels={tickLabels}
                initialVal={filterOptions[key].threshold}
                autoLabel={autoLabel}
                autoLabelUnit={unit}
                onAfterChange={val => onSubmitSliderChange(key, val)}></Slider>
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