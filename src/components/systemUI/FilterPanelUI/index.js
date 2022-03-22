import "./FilterPanelUI.scss"
import Checkbox from './Checkbox'
import React from 'react'

export default class FilterPanelUI extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            filterOptTemp: JSON.parse(JSON.stringify(this.props.filterOptions))
        }
    }

    onChange(key, value) {
        const obj = this.state.filterOptTemp
        obj[key].checked = value
        this.setState({...this.state, filterOptTemp: obj})
    }

    onSubmit () {
        this.props.onFilterChange(JSON.parse(JSON.stringify(this.state.filterOptTemp)))
    }

    onReset () {
        const newFilterOptTemp = this.state.filterOptTemp
        Object.keys(this.state.filterOptTemp).forEach(key => {
            newFilterOptTemp[key].checked = false
        })
        this.setState({...this.state, optionObjTemp: newFilterOptTemp})

        this.props.onFilterChange(JSON.parse(JSON.stringify(newFilterOptTemp)))
    }

    render () {
        return (<div className="filter-panel-container">
            <Checkbox options={this.state.filterOptTemp} onChange={this.onChange.bind(this)}></Checkbox>
            <button onClick={this.onSubmit.bind(this)}>Submit</button>
            <button onClick={this.onReset.bind(this)}>Reset</button>
        </div>)
    }
}