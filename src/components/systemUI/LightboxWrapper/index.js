import "./LightboxWrapper.scss"

export default function LightboxWrapper (props) {
  return (
    <div className={`lightbox-wrapper ${props.isOpen ? 'open' : ''}`}>
      <div className="lightbox-container">
        <button className="close-button" onClick={props.onClose}>X</button>
        {props.children}
      </div>
    </div>
  )
}