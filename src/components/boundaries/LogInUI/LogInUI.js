import './LoginUI.scss'
import React, { useState } from "react";
import RegisterUI from './RegisterUI'
import { useGoogleAuth } from '../../controls/GoogleAuth'
import { userAuthMgr } from '../../controls/Mgr'

// https://stackoverflow.com/questions/48849948/keeping-google-login-persistent-on-reloading-single-page-react-app

// loginState
// login view 0
// update password view 1
// register view 2

/**
 * @namespace LogInUI
 * @description boundary module
 * @property {String} email
 * @property {String} pw
 * @property {String} loginErrorMsg
 */
const LogInUI = props => {
    const {signIn: googleSignIn} = useGoogleAuth()
    const {onRegisterChange, isRegistering} = props
    const [email, setEmail] = useState('')
    const [pw, setPW] = useState('')
    const [loginErrorMsg, setLoginErrorMsg] = useState('')

    /**
     * @typedef {function} onLogInGoogle
     * @memberof LogInUI
     */
    const onLogInGoogle = () => {
        googleSignIn()
    }

    /**
     * @typedef {function} onLogInManual
     * @memberof LogInUI
     */
    const onLogInManual = () => {

    }

    /**
     * @typedef {function} onRegisterGoogle
     * @memberof LogInUI
     */
    const onRegisterGoogle = () => {
        googleSignIn()
    }

    /**
     * @typedef {function} onRegisterManual
     * @memberof LogInUI
     */
    const onRegisterManual = () => {

    }

    return (
        <div className="login-container">
            {isRegistering ? <RegisterUI
                onRegisterGoogle={onRegisterGoogle}
                onRegisterManual={onRegisterManual}
                onBack={() => onRegisterChange(false)}></RegisterUI>
            : 
            <div className="login-main-content">
               <button onClick={onLogInGoogle}>Login with Google</button>
                <div>Or</div>
                <div className="input-field input-email">
                    <span>Email: </span><input type="text" />
                </div>
                <div className="input-field input-password">
                    <span>Password: </span><input type="text" />
                </div>
                <button>Login</button>
                <div className="google-login-container">
                    
                    {"Does not have an account?"}<span className="register-ui-entry-button text-button" onClick={() => onRegisterChange(true)}>Register</span>
                  
                </div>
            </div>}
        </div>)
}

export default LogInUI