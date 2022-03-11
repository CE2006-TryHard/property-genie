import './LoginUI.scss'
import React from "react";
import { GoogleLogInButton } from '../MiscUI'
import User from './../../entities/User'
import { userInfoMgr } from '../../systemMgr/GlobalContext';
// https://stackoverflow.com/questions/48849948/keeping-google-login-persistent-on-reloading-single-page-react-app

export default class LoginUI extends React.Component {
    render () {
        return (
            <div className={`login-container`}>
                <div className="conventional-login-container">
                    <div className="input-name">
                    <span>Email: </span><input type="text" />
                    </div>
                    <div className="input-password">
                    <span>Password: </span><input type="text" />
                    </div>
                    <button>SignUp/Login</button>
                </div>
                <div className="google-login-container">
                    Or <button onClick={this.props.onLogIn}>Login with Google</button>
                </div>
            </div>
        )
    }
}