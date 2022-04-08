import {ReactComponent as HomeLogo} from './../../../images/home.svg'
import {ReactComponent as SgLogo} from './../../../images/sg.svg'
import {Scrollbars} from 'react-custom-scrollbars-2'
import './MiscUI.scss'
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
 * Side panel wrapper component
 * @param {Object} props
 */
const SidePanelWrapper = props => {
  const {isOpen, hideCloseButton, onToggle, onClose, children} = props
  const [hoverOnCloseRegion, setHoverOnCloseRegion] = useState(false)

  return (
      <div className={`side-panel-entry ${isOpen ? 'open' : ''}`}>
          {hideCloseButton ? '' :
            <svg onClick={onToggle} className="side-panel-toggle-button" version="1.1" viewBox="0 0 35 35" enableBackground="new 0 0 35 35">
                <circle fill="#FFFFFF" opacity="0.5" cx="18.2" cy="17.6" r="15.5"></circle>
                {isOpen ? <g>
                  <line stroke="#3C73A8" x1="12.8" y1="12.2" x2="23.5" y2="22.8" strokeWidth="1.7" strokeMiterlimit="10" fill="none"></line>
                  <line stroke="#3C73A8" x1="12.8" y1="22.8" x2="23.5" y2="12.2" strokeWidth="1.7" strokeMiterlimit="10" fill="none"></line>
                  </g>
                  :
                  <g>
                  <line stroke="#333333" x1="10.5" y1="13.2" x2="26.1" y2="13.2" strokeWidth="1.7" strokeMiterlimit="10" fill="none"></line>
                  <line stroke="#333333" x1="10.5" y1="17.6" x2="26.1" y2="17.6" opacity="1" strokeWidth="1.7" strokeMiterlimit="10" fill="none"></line>
                  <line stroke="#333333" x1="10.5" y1="21.9" x2="26.1" y2="21.9" strokeWidth="1.7" strokeMiterlimit="10" fill="none"></line>
                  </g>}
            </svg>}
          <div className={`side-panel-container ${hoverOnCloseRegion ? 'closing' : ''} ` + props.className}>
              {/* <div className="side-panel-content"> */}
                <Scrollbars className="side-panel-content" style={{width:300, height: `calc(100%)`}}>
                  {children}
                </Scrollbars>
                
              {/* </div> */}
              <div className="close-region"
                onClick={onClose}
                onMouseOver={() => setHoverOnCloseRegion(true)}
                onMouseOut={() => setHoverOnCloseRegion(false)}></div>
          </div>
        </div>
  )
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

export {GreetUserMsg, HomeLogo, SgLogo, TabButton, CheckBox, SidePanelWrapper, Slider, GoogleSignInButton}
