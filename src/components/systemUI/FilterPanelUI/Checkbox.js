export default function CheckBox(props) {

    const onChange = (optKey) => {
        props.onChange(optKey, !props.options[optKey])
    }

    return (<div className="checkbox-container">
        {Object.keys(props.options).map((optKey, i) => (<div key={i}>
            <input type="checkbox" id={optKey} value={optKey} onChange={() => onChange(optKey)}></input>
            <label htmlFor={optKey}>{optKey}</label><br></br>
        </div>))
        }
    </div>)
}