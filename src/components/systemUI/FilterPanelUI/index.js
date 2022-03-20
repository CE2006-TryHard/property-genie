import "./FilterPanelUI.scss"
import {filterMgr} from '../../systemMgr/Mgr'
import Checkbox from './Checkbox'
import React from 'react'

export default class FilterPanelUI extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            filterOptTemp: this.props.filterOptions
            // optionObj: filterMgr.getFilterOptions()
        }
    }

    onChange(key, value) {
        const obj = {...this.state.filterOptTemp} // make sure it can trigger rerender during onSubmit
        obj[key].checked = value
        this.setState({...this.state, filterOptTemp: obj})
        
        console.log('on change', key, value)
    }

    onSubmit () {
        this.props.onFilterChange(this.state.filterOptTemp)
    }

    onReset () {
        // filterMgr.resetUserFilterOption()
        const newFilterOptTemp = this.state.filterOptTemp
        Object.keys(this.state.filterOptTemp).forEach(key => {
            newFilterOptTemp[key].checked = false
        })
        this.setState({...this.state, optionObjTemp: newFilterOptTemp})

        this.props.onFilterChange(newFilterOptTemp)
    }

    render () {
        return (<div className="filter-panel-container">
            <Checkbox options={this.state.filterOptTemp} onChange={this.onChange.bind(this)}></Checkbox>
            <button onClick={this.onSubmit.bind(this)}>Submit</button>
            <button onClick={this.onReset.bind(this)}>Reset</button>
        </div>)
    }
}