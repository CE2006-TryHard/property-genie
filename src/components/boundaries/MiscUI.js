import {ReactComponent as HomeLogo} from './../../images/home.svg'
import {ReactComponent as SgLogo} from './../../images/sg.svg'
import { useState } from 'react'

/**
 * Functional Component displays greet user message after user logged in.
 * @param {Object} props
 */
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
              className={`tab-item ${props.current === opt ? 'current' : ''}`}
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
    return `checkbox-item ${options[key].checked ? 'checked' : ''}`
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
          <div className={`side-panel-container ${hoverOnCloseRegion ? 'closing' : ''}`}>
              <div className="side-panel-content">
                {children}
              </div>
              <div className={"close-region"}
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
  const {title, min, max, step, initialVal, onAfterChange} = props
  const [val, setVal] = useState(initialVal)
  return (<div className="slider">
          <span className="slider-title">{title}</span>
          <input type='range' min={min} max={max} step={step} value={val}
          onChange={e => setVal(e.target.value)}
          onMouseUp={() => onAfterChange(val)}
          onTouchEnd={() => onAfterChange(val)}/>
      </div>)
}

export {GreetUserMsg, HomeLogo, SgLogo, TabButton, CheckBox, SidePanelWrapper, Slider}
