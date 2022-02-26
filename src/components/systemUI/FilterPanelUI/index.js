import "./FilterPanelUI.scss"
import {filterMgr} from './../../systemMgr/GlobalContext'
import Checkbox from './Checkbox'
import React from 'react'

export default class FilterPanelUI extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            optionObj: {}
        }

        filterMgr.getFilterOptions().forEach(opt => {
            this.state.optionObj[opt.label] = false
        })
        this.setState({optionObj: this.state.optionObj})
    }

    onChange(key, value) {
        const obj = this.state.optionObj
        obj[key] = value
        this.setState({optionObj: obj})
    }

    onSubmit () {
        filterMgr.updateUserFilterOption(this.state.options)
    }

    onReset () {
        filterMgr.resetUserFilterOption()
    }

    render () {
        return (<div className="filter-panel-container">
            <Checkbox options={this.state.optionObj} onChange={this.onChange.bind(this)}></Checkbox>
            <button onClick={this.onSubmit}>Submit</button>
            <button onReset={this.onReset}>Reset</button>
        </div>)
    }
}