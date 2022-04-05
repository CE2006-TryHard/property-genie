import './LoginUI.scss'
import React, { useState } from "react";
import {GoogleSignInButton} from './../MiscUI'
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

        if (!checkIsValidEmailFormat(email)) {
            setLoginErrorMsg('Please enter a valid email!')
            return
        }

        if (checkIsEmptyString(email) || checkIsEmptyString(pw)) {
            setLoginErrorMsg('Please enter email and password.')
            return
        }

        emailPasswordSignIn(email, pw, (success, errCode) => {
            if (!success) {
                switch(errCode) {
                    case 'auth/invalid-email':
                        setLoginErrorMsg('Invalid email. Please try again.')
                        // console.log('invalid email!')
                        break
                    case 'auth/user-not-found':
                        setLoginErrorMsg('Email does not exist!')
                        // console.log('user does not exist!')
                        break
                    case 'auth/wrong-password':
                        setLoginErrorMsg('Wrong password! Please try again.')
                        // console.log('wrong pasword!')
                        break
                        default:
                        console.log('error on manual sign in', errCode)
                        break
                    }
            }
        })
    }

    return (
        <div className="login-container">
            <div className="login-main-content">
                <GoogleSignInButton onClick={googleSignIn}></GoogleSignInButton>
                <div>Or</div>
                <div className="input-field input-email">
                    <span>Email: </span><input type="text" onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className="input-field input-password">
                    <span>Password: </span><input type="text" onChange={e => setPW(e.target.value)}/>
                </div>
                <button onClick={onVerifyManualLogIn}>Login</button>
                <p>{loginErrorMsg}</p>
            </div>
            {props.children}
        </div>)
}

export default LogInUI