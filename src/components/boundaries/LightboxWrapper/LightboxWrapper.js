import "./LightboxWrapper.scss"
import { useState } from "react"

const LightboxWrapper = props => {
  const {onClose} = props
  const [isHoverOnClose, setIsHoverOnClose] = useState(false)
  const onWrapperClick = e => {
    if (e.target.className.indexOf('lightbox-wrapper open') >= 0) {
      onClose()
    }
  }

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