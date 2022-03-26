import {ReactComponent as HomeLogo} from './../../images/home.svg'
import {ReactComponent as SgLogo} from './../../images/sg.svg'

const GreetUserMsg = props => {
  if (props.activeUser) {
    return (
      <div className={`user-greet-msg ${props.alwaysShow ? 'show' : ''}`}>
        Welcome, {props.activeUser.name}
      </div>
    )
  }
  return ''
}

const TabButton = props => {
  const onChange = (newOpt) => {
      props.onChange(newOpt)
  }
  return (<div className="tab-button-container">
      {props.options.map((opt, i) => 
          (<div key={i}
              className={`tab-item ${props.current === opt ? 'current' : ''}`}
              onClick={() => onChange(opt)}
              >{opt}</div>))}
  </div>)
}

const CheckBox = props => {

  const onChange = (optKey) => {
      props.onChange(optKey, !props.options[optKey].checked)
  }

  return (<div className="checkbox-container">
      {Object.keys(props.options).map((optKey, i) => (<div key={i}>
          <input type="checkbox" id={optKey} value={optKey} checked={!!props.options[optKey].checked} onChange={() => onChange(optKey)}></input>
          <label htmlFor={optKey}>{props.options[optKey].label}</label><br></br>
      </div>))
      }
  </div>)
}

export {GreetUserMsg, HomeLogo, SgLogo, TabButton, CheckBox}