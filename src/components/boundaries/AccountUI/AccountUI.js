import { useState } from "react"

/**
 * @namespace AccountUI
 * @description boundary module
 * @property {String} emailForPWChange user email input string
 * @property {Boolean} showEmailField value to toggle the email text field
 * @property {Boolean} showRequestCompleteMsg value to toggle the display of request complete message.
 */
const AccountUI = props => {
    const {user: {name, email}} = props
    const [emailForPWChange, setEmailForPWChange] = useState('')
    const [showEmailField, setShowEmailField] = useState(false)
    const [showRequestCompleteMsg, setShowRequestCompleteMsg] = useState(false)

      /**
     * @memberof AccountUI
     * @typedef {function} onRequestPWChange called when user clicks on "Update password" button
     */
    const onRequestPWChange = () => {
        setShowEmailField(true)
    }

    /**
 * @memberof AccountUI
 * @typedef {function} onSubmitPWChangeRequest called when user clicks on "Submit request" button
 */
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