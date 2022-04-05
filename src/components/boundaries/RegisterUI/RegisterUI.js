import {useState } from "react"
import { userAuthMgr } from "../../controls/Mgr"
import {GoogleSignInButton} from './../MiscUI'
import './RegisterUI.scss'

/**
 * @namespace RegisterUI
 * @description boundary module
 * @property {String} pw
 * @property {String} confirmPW
 * @property {String} email
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} emailWarningMsg
 * @property {String} pwWarningMsg
 * @property {String} nameWarningMsg
 */
const RegisterUI = props => {
    const [pw, setPW] = useState('')
    const [confirmPW, setConfirmPW] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [emailWarningMsg, setEmailWarningMsg] = useState('')
    const [pwWarningMsg, setPWWarningMsg] = useState('')
    const [nameWarningMsg, setNameWarningMsg] = useState('')

    const {checkIsEmptyString, checkIsValidEmailFormat, sendRegisterEmail, googleSignIn} = userAuthMgr
    /**
     * @memberof RegisterUI
     * @typedef {function} verifyEmail
     * @return {Boolean}
     */
    const verifyEmail = () => {
        const isEmpty = checkIsEmptyString(email)
        const invalidEmail = !checkIsValidEmailFormat(email)
        if (isEmpty) setEmailWarningMsg('Please enter your email.')
        else if (invalidEmail) setEmailWarningMsg('You have enter an invalid email address!')
        return !isEmpty && !invalidEmail
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} verifyPW
     * @return {Boolean}
     */
    const verifyPW = () => {
        console.log('verify passwork')
        if (pw !== confirmPW) setPWWarningMsg('Passwords do not match! Please reenter password.')
        else if (pw === '' || confirmPW === '') {
            console.log('empty ps')
            setPWWarningMsg('Please enter your password!')}

        return (pw === confirmPW && pw !== '')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} verifyName
     * @return {Boolean}
     */
    const verifyName = () => {
        const isEmptyFirstName = checkIsEmptyString(firstName)
        const isEmptyLastName = checkIsEmptyString(lastName)
        if (isEmptyFirstName) setNameWarningMsg('Please enter your first name!')
        else if(isEmptyLastName) setNameWarningMsg('Please enter your last name!')
        return (!isEmptyFirstName && !isEmptyLastName)
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onVerifyManualRegister
     */
    const onVerifyManualRegister = () => {
        if (verifyEmail()) {
            
            setEmailWarningMsg('')
            // validateAccountAvailability(email, userExist => {
                // if (userExist) {
                //     setEmailWarningMsg('Email already exists! Please enter a different email.')
                //     return
                // }

            if (verifyName() && verifyPW()) {
                // onRegisterManual({
                //     name: firstName + ' ' + lastName,
                //     email: email,
                //     password: pw
                // })
                sendRegisterEmail({email, password: pw}, (sent, err) => {
                    if (sent) {
                        console.log('sign up link successfully sent')
                    } else {
                        console.log(err)
                        switch (err.code) {
                            case 'auth/email-already-in-use':
                                console.log('account exist!')
                                break;
                            case 'auth/weak-password':
                                console.log('Please set a password at least 6 characters long!.')
                                break
                        }
                        
                    }
                })
            } else {
                verifyName()
                verifyPW()
            }
            // })
        } else {
            verifyName()
            verifyPW()
        }
        
    }

    // /**
    //  * @memberof RegisterUI
    //  * @typedef {function} onRegisterGoogle
    //  */
    // const onRegisterGoogle = () => {
    //     props.onRegisterGoogle()
    // }

    /**
     * @memberof RegisterUI
     * @typedef {function} onEmailChange
     * @param {Event} e
     */
    const onEmailChange = e => {
        setEmail(e.target.value)
        setEmailWarningMsg('')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onFirstNameCange
     * @param {Event} e
     */
    const onFirstNameCange = e => {
        setFirstName(e.target.value)
        setNameWarningMsg('')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onLastNameChange
     * @param {Event} e
     */
    const onLastNameChange = e => {
        setLastName(e.target.value)
        setNameWarningMsg('')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onPWChange
     * @param {Event} e
     */
    const onPWChange = e => {
        setPW(e.target.value)
        setPWWarningMsg('')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onConfirmPWChange
     * @param {Event} e
     */
    const onConfirmPWChange = e => {
        setConfirmPW(e.target.value)
        setPWWarningMsg('')
    }

    return (<div className="register-container">
        <GoogleSignInButton onClick={googleSignIn} label="Sign Up with Google"></GoogleSignInButton>
            <div>Or</div>
            <div className="input-field input-email">
                <span>Email: </span><input type="text" value={email} onChange={onEmailChange}/>
                <p className="warning">{emailWarningMsg}</p>
            </div>
            <div className="input-field input-name">
                <div className="sub-input-field">
                    <span>First name: </span><input type="text" value={firstName} onChange={onFirstNameCange}/><br />
                </div>
                <div className="sub-input-field">
                <span>Last name:</span><input type="text" value={lastName} onChange={onLastNameChange}/>
                </div>
                <p className="warning">{nameWarningMsg}</p>
            </div>
            <div className="input-field input-password">
                <div className="sub-input-field">
                    <span>Password: </span><input type="text" value={pw} onChange={onPWChange}/><br />
                </div>
                <div className="sub-input-field">
                    <span>Confirm Password: </span><input type="text" value={confirmPW} onChange={onConfirmPWChange}/>
                </div>
                <p className="warning">{pwWarningMsg}</p>
            </div>
            <button onClick={onVerifyManualRegister}>Register</button>
            <button onClick={props.onBack}>Back</button>
        </div>)
}

export default RegisterUI