import "./LightboxWrapper.scss"
import { useState } from "react"

/**
 * @namespace LightboxWrapper
 * @description boundary module
 * @property {Boolean} isHoverOnClose
 */
const LightboxWrapper = props => {
  const {onClose} = props
  const [isHoverOnClose, setIsHoverOnClose] = useState(false)

/**
   * @memberof LightboxWrapper
  * @typedef {function} onWrapperClick called when user click on wrapper area
  * @param {Event} e
  */
  const onWrapperClick = e => {
    if (e.target.className.indexOf('lightbox-wrapper open') >= 0) {
      onClose()
    }
  }

  /**
   * @memberof LightboxWrapper
  * @typedef {function} onHoverOnCloseRegion called when user hover on wrapper area
  * @param {Event} e
  */
  const onHoverOnCloseRegion = e => {
    setIsHoverOnClose(e.target.className.indexOf('lightbox-wrapper open') >= 0)
    // console.log('test')
  }

  return (
    <div title={isHoverOnClose ? 'Click outside to close the panel.' : ''}
      className={`lightbox-wrapper ${props.isOpen ? 'open' : ''} ${isHoverOnClose ? 'inclose' : ''}`}
      onClick={onWrapperClick} onMouseOver={onHoverOnCloseRegion}>
      <div className="lightbox-container">
        {props.hideCloseButton ? "" : <span className="close-button" onClick={onClose}></span>}
        {props.children}
        </div>
    </div>
  )
}

export default LightboxWrapper