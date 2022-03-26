import './LoginUI.scss'
import React from "react";
import RegisterUI from './RegisterUI'
import { useGoogleAuth } from '../../controls/GoogleAuth'
// https://stackoverflow.com/questions/48849948/keeping-google-login-persistent-on-reloading-single-page-react-app

// loginState
// login view 0
// update password view 1
// register view 2
const LogInUI = props => {
    const {signIn} = useGoogleAuth()
    const onRegisterGoogle = () => {
        this.props.onLogInGoogle()
    }

    const onRegisterManual = userInfo => {
        props.onRegisterManual(userInfo)
    }

    const onLogInGoogle = () => {
        signIn()
    }

    const onLogInManual = () => {

    }

    const {onRegisterChange, isRegistering} = props
    return (
        <div className="login-container">
            {isRegistering ? <RegisterUI onRegisterManual={onRegisterManual} onRegisterGoogle={onRegisterGoogle} onBack={() => onRegisterChange(false)}></RegisterUI>
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