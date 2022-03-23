import './LoginUI.scss'
import React from "react";
import RegisterUI from './RegisterUI'

// https://stackoverflow.com/questions/48849948/keeping-google-login-persistent-on-reloading-single-page-react-app

// loginState
// login view 0
// update password view 1
// register view 2

export default class LoginUI extends React.Component {
    constructor (props) {
        super(props)
    }

    onRegisterGoogle () {
        this.props.onLogInGoogle()
    }

    onRegisterManual (userInfo) {
        this.props.onRegisterManual(userInfo)
    }

    render () {
        const {onRegisterChange} = this.props
        return (
        <div className="login-container">
            {this.props.isRegistering ? <RegisterUI onRegisterManual={this.onRegisterManual.bind(this)} onRegisterGoogle={this.onRegisterGoogle.bind(this)} onBack={() => onRegisterChange(false)}></RegisterUI>
            : 
            <div className="login-main-content">
               <button onClick={this.props.onLogInGoogle}>Login with Google</button>
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
                    {/* <button onClick={this.onEnterRegisterUI.bind(this)}>test</button> */}
                  
                </div>
            </div>}
        </div>)
    }
}