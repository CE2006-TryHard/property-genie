export default function TabButton (props) {
    const onChange = (newOpt) => {
        props.onChange(newOpt)
    }
    return (<div className="tab-button-container">
        {props.options.map((opt, i) => 
            (<div key={i}
                className={`tab-item ${props.current == opt ? 'current' : ''}`}
                onClick={() => onChange(opt)}
                >{opt}</div>))}
    </div>)
}
