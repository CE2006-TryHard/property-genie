export default function SidePanelButton(props) {
    const onClick = () => {
        props.onClick(props.value)
    }
    return (
        <svg onClick={onClick} className="side-panel-toggle-button" version="1.1" viewBox="0 0 35 35" enableBackground="new 0 0 35 35">
            <circle fill="#FFFFFF" opacity="0.5" cx="18.2" cy="17.6" r="15.5"></circle>
            <line stroke="#333333" x1="10.5" y1="13.2" x2="26.1" y2="13.2" strokeWidth="1.7" strokeMiterlimit="10" fill="none">
                <animate attributeName="y2" from="13.2" to="21.9" dur="0.5s" />
            </line>
            <line stroke="#333333" x1="10.5" y1="17.6" x2="26.1" y2="17.6" opacity="1" strokeWidth="1.7" strokeMiterlimit="10" fill="none">
                <animate attributeName="x2" from="26.1" to="10.5" dur="0.5s" />
            </line>
            <line stroke="#333333" x1="10.5" y1="21.9" x2="26.1" y2="21.9" strokeWidth="1.7" strokeMiterlimit="10" fill="none">
            <animate attributeName="y2" from="21.9" to="13.2" dur="0.5s" />
            </line>
        </svg>
    )
}