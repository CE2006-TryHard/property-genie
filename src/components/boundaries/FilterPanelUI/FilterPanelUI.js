import "./FilterPanelUI.scss"
import { CheckBox, Slider } from "../MiscUI/MiscUI"
import {useDispatch, useSelector} from 'react-redux'
import { setFilterCheckBox, setFilterSlider, resetFilters } from "../../../features/filterSlice"
/**
 * @namespace FilterPanelUI
 * @description boundary module
 */
const FilterPanelUI = props => {
    const dispatch = useDispatch()
    const filterOptions = useSelector(state => state.filterOptions)
    // const {filterOptions, onFilterChange} = props

    /**
    * @memberof FilterPanelUI
    * @typedef {function} onCheckboxChange called when user checks/unchecks a filter checkbox.
    * @param {String} key Filter option ID
    * @param {Boolean} value filter option "checked" value
    */
    const onCheckboxChange = (key, value) => {
        dispatch(setFilterCheckBox({key, value}))
    }

    /**
     * @typedef {function} onSubmitSliderChange called when user finish changing slider value.
     * @param {String} key Filter option ID 
     * @param {Number} value filter option "threshold" value 
     */
    const onSubmitSliderChange = (key, value) => {
        dispatch(setFilterSlider({key, value}))
    }

    /**
     * @memberof FilterPanelUI
    * @typedef {function} onReset called when user reset(uncheck) all filter checkbox.
    */
    const onReset = () => {
        dispatch(resetFilters())
    }

    const filterOptionFormat = [
        {
            key: 'score',
            label: 'Minimum score',
            min: 0,
            max: 100,
            step: 10,
            autoLabel: true,
            unit: '%',
            tickLabels: ['0%', '100%']
        },
        {
            key: 'enbloc',
            label: 'En Bloc probability',
            min: 0,
            max: 1,
            step: 0.25,
            tickLabels: ['<20%', '<40%', '<60%', '<80%', '&#8804<b></b>100%']
            // tickLabels: ['<20%', '20%-39%', '40%-59%', '60%-79%', '>80%']
        },
        {
            key: 'distToMrt',
            label: 'Distance to MRT',
            min: 0.2,
            max: 4,
            step: 0.1,
            autoLabel: true,
            unit: 'km',
            preUnit: '&#8804',
            tickLabels: ['0.2km', `4km`]
        },
        {
            key: 'distToSchool',
            label: 'Distance to School',
            min: 0.2,
            max: 4,
            step: 0.1,
            autoLabel: true,
            unit: 'km',
            preUnit: '&#8804',
            tickLabels: ['0.2km', `4km`]
        }
    ]

    

    const checkBoxOptions = Object.keys(filterOptions)
        .filter(filterKey => filterKey !== 'score')
        .reduce((acc, filterKey) => {
            acc[filterKey] = filterOptions[filterKey]
        return acc
    }, {})

    return (
    <div className="filter-panel-container">
        <div className="value-section">
            <h5 className="noselect">Calculates property's score by:</h5>
            <CheckBox options={checkBoxOptions} onChange={onCheckboxChange}></CheckBox>
        </div>
        <div className="filter-section">
            <h5 className="noselect">Futher customize the properties you want to see</h5>
            {filterOptionFormat.map(({key,label, min, max, step, autoLabel, unit, preUnit, tickLabels}) => (
                <Slider enabled={filterOptions[key].checked} key={key} title={label} min={min} max={max} step={step}
                tickLabels={tickLabels}
                initialVal={filterOptions[key].threshold}
                autoLabel={autoLabel}
                autoLabelPreUnit={preUnit || ''}
                autoLabelUnit={unit || ''}
                onAfterChange={val => onSubmitSliderChange(key, val)}></Slider>
            ))}
        </div>
        <div className="reset-button-container">
            <div className="reset-button noselect" title="Reset to default filter settings" onClick={onReset}>Reset</div>
        </div>
    </div>
    )
    
}

export default FilterPanelUI