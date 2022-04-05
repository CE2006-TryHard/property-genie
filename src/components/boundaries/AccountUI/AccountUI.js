import { useState } from "react"
import { userAuthMgr } from "../../controls/Mgr"
import './AccountUI.scss'

/**
 * @namespace AccountUI
 * @description boundary module
 * @property {Boolean} showRequestCompleteMsg value to toggle the display of request complete message.
 */
const AccountUI = props => {
    const {user: {name, email, loginViaGoogle, isVerified}} = props
    const [showRequestCompleteMsg, setShowRequestCompleteMsg] = useState(false)
    const [emailVerifyMsg, setEmailVerifyMsg] = useState('Email must be verified in order to access password reset feature.')

      /**
     * @memberof AccountUI
     * @typedef {function} onRequestPWChange called when user clicks on "Update password" button
     */
    const onRequestPWChange = () => {
        userAuthMgr.requestPasswordChange(email, () => {
            setShowRequestCompleteMsg(true)
        })
    }

    const onVerifyEmail = () => {
        userAuthMgr.sendEmailVerificationRequest((success) => {
            if (success) {
                setEmailVerifyMsg('Email verification link sent. Please check your email.')
            } else {
                setEmailVerifyMsg('Email must be verified in order to access password reset feature.')
            }
        })
    }

    return (<div className="account-ui-container">
        <h3>User info</h3>
        <p>Registered via {loginViaGoogle ? 'Google Account' : 'Email'}</p>
        {name ? <p><b>Name:</b> {name}</p> : ''}
        <p className="email"><b>Email:</b> {email}</p>
        <div className="account-verify-info">
            {isVerified ?
                <b className="verified">Verified</b> :
                <div>
                    <b className="notVerified">Not Verified</b><span onClick={onVerifyEmail} className="text-button verify-email-button">Verify Email</span>
                    <p className="account-verify-info-warning">{emailVerifyMsg}</p>
                    
                </div>}
        </div>
        
        {loginViaGoogle || showRequestCompleteMsg ? '' : <div title={isVerified ? '' : 'Verify email to reset password'} className={`update-password-button ${isVerified ? 'enabled' : ''}`} onClick={isVerified ? onRequestPWChange : null}>Reset password</div>}

        {showRequestCompleteMsg ? <p className="reset-password-msg">{`Request submitted. A password reset link will be sent to ${email}.`}</p> : ''}
    </div>)
}

export default AccountUI
