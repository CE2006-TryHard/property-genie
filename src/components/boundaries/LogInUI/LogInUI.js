import './LoginUI.scss'
import React, { useState } from "react";
import {GoogleSignInButton} from '../MiscUI/MiscUI'
import { userAuthMgr } from '../../controls/Mgr'

/**
 * @namespace LogInUI
 * @description boundary module
 * @property {String} email
 * @property {String} pw
 * @property {String} loginErrorMsg
 */
const LogInUI = props => {
    const [email, setEmail] = useState('')
    const [pw, setPW] = useState('')
    const [loginErrorMsg, setLoginErrorMsg] = useState('')

    const {googleSignIn, emailPasswordSignIn, checkIsValidEmailFormat, checkIsEmptyString} = userAuthMgr
    /**
     * @typedef {function} onVerifyManualLogIn
     * @memberof LogInUI
     */
    const onVerifyManualLogIn = () => {
        setLoginErrorMsg('')
        if (!checkIsValidEmailFormat(email) || checkIsEmptyString(email)) {
            setLoginErrorMsg('Please enter a valid email!')
            return
        }

        if (checkIsEmptyString(pw)) {
            setLoginErrorMsg('Please enter your password.')
            return
        }

        emailPasswordSignIn(email, pw, (success, errCode) => {
            if (!success) {
                switch(errCode) {
                    case 'auth/invalid-email':
                        setLoginErrorMsg('Invalid email. Please try again.')
                        break
                    case 'auth/user-not-found':
                        setLoginErrorMsg('Email does not exist!')
                        break
                    case 'auth/wrong-password':
                        setLoginErrorMsg('Wrong password! Please try again.')
                        break
                        default:
                        console.log('error on manual sign in', errCode)
                        break
                    }
            }
        })
    }

    /**
     * @memberof LoginUI
     * @typedef {function} onEmailChange
     * @param {Event} e
     */
     const onEmailChange = e => {
        setEmail(e.target.value)
        setLoginErrorMsg('')
    }

    /**
     * @memberof LoginUI
     * @typedef {function} onPWChange
     * @param {Event} e
     */
     const onPWChange = e => {
        setPW(e.target.value)
        setLoginErrorMsg('')
    }

    return (
        <div className="login-container">
            <div className="login-main-content">
                <div className="google-button-container">
                <p className="google-sign-in-info">To skip email verification,<br />sign in/sign up with Google.</p>
                    <GoogleSignInButton onClick={googleSignIn}></GoogleSignInButton>
                </div>
                
                <p className="or-text"><b>Or</b></p>
                <div className="input-field-container">
                    <div className="input-field input-email">
                        <span>Email: </span><input type="text" onChange={onEmailChange}/>
                    </div>
                    <div className="input-field input-password">
                        <span>Password: </span><input type="text" onChange={onPWChange}/>
                    </div>
                    <p className="warning-text">{loginErrorMsg}</p>
                </div>
                <div className="login-button-container">
                    <div className="login-button" onClick={onVerifyManualLogIn}>Sign In</div>
                </div>
            </div>
            {props.children}
        </div>)
}

export default LogInUI