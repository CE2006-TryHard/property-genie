import './AccountUI.scss'
import { useState } from "react"
import { userAuthMgr } from "../../controls/Mgr"
import {useDispatch} from 'react-redux'
import { setLoadingState } from '../../../features'

/**
 * @namespace AccountUI
 * @description boundary module
 * @property {Boolean} showRequestCompleteMsg value to toggle the display of request complete message.
 */
const AccountUI = props => {
    const dispatch = useDispatch()
    const {activeUser: {name, email, isGoogleAuth, isVerified}} = props
    const [showRequestCompleteMsg, setShowRequestCompleteMsg] = useState(false)
    const [emailVerifyMsg, setEmailVerifyMsg] = useState('Email must be verified in order to access password reset feature.')
    const [pwResetMsg, setPWResetMsg] = useState('')

      /**
     * @memberof AccountUI
     * @typedef {function} onRequestPWChange called when user clicks on "Update password" button
     */
    const onRequestPWChange = () => {
        dispatch(setLoadingState(3))
        userAuthMgr.requestPasswordChange(email, (success, errCode) => {
            dispatch(setLoadingState(0))
            if (success) {
                setShowRequestCompleteMsg(true)
                setPWResetMsg(`Request submitted. A password reset link will be sent to ${email}.`)
            } else {
                switch (errCode) {
                    case 'auth/too-many-requests':
                    setPWResetMsg('Too many requests. Please try again later.')
                    break
                    default:
                        console.log(errCode)
                        break
                }
            }
            
            
        })
    }

    /**
     * @memberof AccountUI
     * @typedef {function} onVerifyEmail called when user clicks on "Verify Email" button
     */
    const onVerifyEmail = () => {
        dispatch(setLoadingState(3))
        userAuthMgr.sendEmailVerificationRequest((success, errCode) => {
            dispatch(setLoadingState(0))
            if (success) {
                setEmailVerifyMsg('Email verification link sent. Please check your email.')
            } else {
                switch(errCode) {
                    case 'auth/too-many-requests':
                        setEmailVerifyMsg('Too many requests. Please try again later.')
                        break;
                    default:
                        console.log(errCode)
                        break
                }
            }
        })
    }

    return (<div className="account-ui-container">
        <h3>Account {isVerified ? <span className="verified">verified</span> : <span className="notVerified">not verified</span>}</h3>
        {name ? <p><b>Name:</b> {name}</p> : ''}
        <p className="email"><b>Email:</b> {email}</p>
        <p className="register-via">Registered via <b>{isGoogleAuth ? 'Google Account' : 'Email'}</b></p>
        <div className="account-verify-info">
            {isVerified ? '' :
            <div>
                <span onClick={onVerifyEmail} className="text-button verify-email-button">Verify Email</span>
                <p className="account-verify-info-warning">{emailVerifyMsg}</p>
            </div>}
        </div>
        
        {isGoogleAuth || showRequestCompleteMsg ? '' : <div title={isVerified ? '' : 'Verify email to reset password'} className={`update-password-button ${isVerified ? 'enabled' : ''}`} onClick={isVerified ? onRequestPWChange : null}>Reset password</div>}

        {showRequestCompleteMsg ? <p className="reset-password-msg">{pwResetMsg}</p> : ''}
    </div>)
}

export default AccountUI
