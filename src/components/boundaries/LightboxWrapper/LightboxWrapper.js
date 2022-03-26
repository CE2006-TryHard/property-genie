import "./LightboxWrapper.scss"
import { useState } from "react"

const LightboxWrapper = props => {
  const {onClose} = props
  const [inCloseRegion, setInCloseRegion] = useState(false)
  const onWrapperClick = e => {
    if (e.target.className.indexOf('lightbox-wrapper open') >= 0) {
      onClose()
    }
  }

  const onEnterCloseRegion = e => {
    setInCloseRegion(e.target.className.indexOf('lightbox-wrapper open') >= 0)
    // console.log('test')
  }

  return (
    <div title={inCloseRegion ? 'Click outside to close the panel.' : ''} className={`lightbox-wrapper ${props.isOpen ? 'open' : ''} ${inCloseRegion ? 'inclose' : ''}`} onClick={onWrapperClick} onMouseOver={onEnterCloseRegion}>
      <div className="lightbox-container">
        {props.hideCloseButton ? "" : <span className="close-button" onClick={onClose}></span>}
        {props.children}
        </div>
    </div>
  )
}

export default LightboxWrapper