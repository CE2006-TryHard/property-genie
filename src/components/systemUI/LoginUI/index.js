import './LoginUI.scss'
import React from "react";
import { GoogleLogInButton } from '../MiscUI'
import User from './../../entities/User'
import { userInfoMgr } from '../../systemMgr/Mgr';
// https://stackoverflow.com/questions/48849948/keeping-google-login-persistent-on-reloading-single-page-react-app

// loginState
// login view 0
// update password view 1
// register view 2

export default class LoginUI extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loginState: 0
        }
    }

    render () {
        return (
            <div className={`login-container`}>
                <div className="login-content">
                    <div className="input-name">
                    <span>Email: </span><input type="text" />
                    </div>
                    <div className="input-password">
                    <span>Password: </span><input type="text" />
                    </div>
                    {/* <div>Forgot/Wish to update password?<span className="inline-button">Update password</span></div> */}
                    <button>Login</button>

                    <div className="google-login-container">
                        Or <button onClick={this.props.onLogIn}>Login with Google</button>
                        <div>
                        {"Does not have an account?"}<span className="inline-button">Register</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}