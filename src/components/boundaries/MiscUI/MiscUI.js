import './MiscUI.scss'
import {ReactComponent as HomeLogo} from './../../../images/home.svg'
import {ReactComponent as SgLogo} from './../../../images/sg.svg'
import {useEffect, useState } from 'react'

/**
 * Functional Component displays greet user message after user logged in.
 * @param {Object} props
 */
const GreetUserMsg = props => {
  if (props.activeUser) {
    return (
      <div className={`user-greet-msg ${props.alwaysShow ? 'show' : ''}`}>
        Welcome, {props.activeUser.name || props.activeUser.email}
      </div>
    )
  }
  return ''
}

/**
 * Tab Button component
 * @param {Object} props
 */
const TabButton = props => {
  const onChange = (newOpt) => {
      props.onChange(newOpt)
  }
  return (<div className="tab-button-container">
      {props.options.map((opt, i) => 
          (<div key={i}
              className={`tab-item noselect ${props.current === opt ? 'current' : ''}`}
              onClick={() => onChange(opt)}
              >{opt}</div>))}
  </div>)
}

/**
 * Checkbox component
 * @param {Object} props
 */
const CheckBox = props => {
  const {options} = props

  const onChange = optKey => {
      props.onChange(optKey, !props.options[optKey].checked)
  }

  const checkBoxItemClass = key => {
    return `checkbox-item noselect ${options[key].checked ? 'checked' : ''}`
  }

  return (<div className="checkbox-container">
      {Object.keys(props.options).map((optKey, i) => 
          <div key={i} className={checkBoxItemClass(optKey)} onClick={() => onChange(optKey)}>{options[optKey].label}</div>
      )}
      </div>)
}

/**
 * Slider Component
 * @param {Object} props 
 */
const Slider = props => {
  const {enabled, title, min, max, step, initialVal, tickLabels, autoLabel, autoLabelUnit, autoLabelPreUnit, onAfterChange} = props
  const [val, setVal] = useState(initialVal)

  useEffect(() => {
    setVal(initialVal)
  }, [initialVal])

  return (<div className={`slider ${enabled ? '' : 'disabled'}`}>
          <p className="slider-title noselect">{title}:&nbsp; 
            {autoLabel ? <b>
              <span dangerouslySetInnerHTML={{__html:autoLabelPreUnit}}></span>
              {val}
              <span dangerouslySetInnerHTML={{__html:autoLabelUnit}}></span>
            </b> : <b>
            <span dangerouslySetInnerHTML={{__html:tickLabels[val/step]}}></span>
              </b>}
              </p>
          <div className="slider-content">
            <input type='range' min={min} max={max} step={step} value={val}
              onChange={e => setVal(parseFloat(e.target.value))}
              onMouseUp={e => onAfterChange(e.target.value)}
              onTouchEnd={e => onAfterChange(e.target.value)}/>
              <div>
              {
                tickLabels.map((t, i) => <span className="tick" key={i} style={{'left': `calc(${(1/(tickLabels.length-1) * i)*100}%)`}}>
                  <span dangerouslySetInnerHTML={{__html:t}}></span>
                </span>)
              }
              </div>
          </div>
      </div>)
}

const GoogleSignInButton = props => {
  return (<div className="google-btn" onClick={props.onClick}>
  <div className="google-icon-wrapper">
    <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
  </div>
  <p className="btn-text"><b>{props.label || 'Sign in with google'}</b></p>
</div>)
}

export {GreetUserMsg, HomeLogo, SgLogo, TabButton, CheckBox, Slider, GoogleSignInButton}
