import { useState } from "react"
import Scrollbars from "react-custom-scrollbars-2"

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

  export default SidePanelWrapper
  