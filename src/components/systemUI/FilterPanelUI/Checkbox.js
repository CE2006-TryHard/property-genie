export default function CheckBox(props) {

    const onChange = (optKey) => {
        props.onChange(optKey, !props.options[optKey].checked)
    }

    return (<div className="checkbox-container">
        {Object.keys(props.options).map((optKey, i) => (<div key={i}>
            <input type="checkbox" id={optKey} value={optKey} checked={!!props.options[optKey].checked} onChange={() => onChange(optKey)}></input>
            <label htmlFor={optKey}>{optKey}</label><br></br>
        </div>))
        }
    </div>)
}