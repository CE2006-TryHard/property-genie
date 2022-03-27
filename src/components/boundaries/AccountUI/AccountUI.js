import { useState } from "react"

const AccountUI = props => {
    const {user: {name, email}} = props
    const [emailForPWChange, setEmailForPWChange] = useState('')
    const [showEmailField, setShowEmailField] = useState(false)
    const [showRequestCompleteMsg, setShowRequestCompleteMsg] = useState(false)

    const onRequestPWChange = () => {
        setShowEmailField(true)
    }

    const onSubmitPWChangeRequest = () => {
        // TODO: invoke Firebase API for email verification

        setShowRequestCompleteMsg(true)
    }
    return (<div className="account-ui-container">
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <button onClick={onRequestPWChange}>Update password</button>

        {showEmailField && !showRequestCompleteMsg? <div className="password-change-request-container">
            <input type='text' value={emailForPWChange} onChange={e => setEmailForPWChange(e.target.value)}></input>
            <button onClick={onSubmitPWChangeRequest}>Submit request</button>
        </div> : ''}

        {showRequestCompleteMsg ? <p>Password change request submitted. A verification link will be sent to your email if it is valid.</p> : ''}
    </div>)
}