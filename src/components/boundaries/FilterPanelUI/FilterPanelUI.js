import "./FilterPanelUI.scss"
import { CheckBox } from "../MiscUI"

const FilterPanelUI = props => {
    const {filterOptions, onFilterChange} = props
    const onChange = (key, value) => {
        const newfilterOptions = JSON.parse(JSON.stringify(filterOptions))
        newfilterOptions[key].checked = value
        onFilterChange(newfilterOptions)
    }

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