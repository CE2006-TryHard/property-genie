import "./FilterPanelUI.scss"
import {filterMgr} from './../../systemMgr/GlobalContext'
import Checkbox from './Checkbox'
import React from 'react'

export default class FilterPanelUI extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            optionObjTemp: filterMgr.getFilterOptions(),
            optionObj: filterMgr.getFilterOptions()
        }
    }

    onChange(key, value) {
        const obj = this.state.optionObjTemp
        obj[key].checked = value
        this.setState({...this.state, optionObjTemp: obj})
        
        console.log('on change', key, value)
    }

    onSubmit () {
        this.setState({...this.state, optionObj: this.state.optionObjTemp})
        filterMgr.updateUserFilterOption(this.state.optionObj)
    }

    onReset () {
        filterMgr.resetUserFilterOption()
        this.setState({
            optionObjTemp: filterMgr.getFilterOptions(),
            optionObj: filterMgr.getFilterOptions()
        })
    }

    render () {
        return (<div className="filter-panel-container">
            <Checkbox options={this.state.optionObjTemp} onChange={this.onChange.bind(this)}></Checkbox>
            <button onClick={this.onSubmit.bind(this)}>Submit</button>
            <button onClick={this.onReset.bind(this)}>Reset</button>
        </div>)
    }
}