import './SignInUI.scss'
import { useState } from "react"
import {GoogleSignInButton} from '../MiscUI/MiscUI'
import { userAuthMgr } from '../../controls/Mgr'
import {useDispatch} from 'react-redux'
import { setLoadingState, setPageState } from '../../../features'

/**
 * @namespace SignInUI
 * @description boundary module
 * @property {String} email
 * @property {String} pw
 * @property {String} errorMsg
 */
const SignInUI = props => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [pw, setPW] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const {googleSignIn, emailPasswordSignIn, checkIsValidEmailFormat, checkIsEmptyString} = userAuthMgr

    const onGoogleSignIn = () => {
        dispatch(setLoadingState(1))
        googleSignIn((success, errCode) => {
            dispatch(setLoadingState(0))
            if (success) {
                dispatch(setPageState(0))
            } else {
                switch (errCode) {
                    case '':
                        break
                    default:
                        console.log('error on google sign in', errCode)
                        break
                }
            }
        })
    }
    /**
     * @typedef {function} onVerifyManualSignIn
     * @memberof SignInUI
     */
    const onVerifyManualSignIn = () => {
        setErrorMsg('')
        if (!checkIsValidEmailFormat(email) || checkIsEmptyString(email)) {
            setErrorMsg('Please enter a valid email!')
            return
        }

        if (checkIsEmptyString(pw)) {
            setErrorMsg('Please enter your password.')
            return
        }

        dispatch(setLoadingState(1))
        emailPasswordSignIn(email, pw, (success, errCode) => {
            dispatch(setLoadingState(0))
            if (success) {
                dispatch(setPageState(0))
            } else {
                switch(errCode) {
                    case 'auth/invalid-email':
                        setErrorMsg('Invalid email. Please try again.')
                        break
                    case 'auth/user-not-found':
                        setErrorMsg('Email does not exist!')
                        break
                    case 'auth/wrong-password':
                        setErrorMsg('Wrong password! Please try again.')
                        break
                        default:
                        console.log('error on manual sign in', errCode)
                        break
                    }
            }
        })
    }

    /**
     * @memberof SignInUI
     * @typedef {function} onEmailChange
     * @param {Event} e
     */
     const onEmailChange = e => {
        setEmail(e.target.value)
        setErrorMsg('')
    }

    /**
     * @memberof SignInUI
     * @typedef {function} onPWChange
     * @param {Event} e
     */
     const onPWChange = e => {
        setPW(e.target.value)
        setErrorMsg('')
    }

    return (
        <div className="signin-container">
            <div className="signin-main-content">
                <div className="google-button-container">
                <p className="google-sign-in-info">To skip email verification,<br />sign in/sign up with Google.</p>
                    <GoogleSignInButton onClick={onGoogleSignIn}></GoogleSignInButton>
                </div>
                
                <p className="or-text"><b>Or</b></p>
                <div className="input-field-container">
                    <div className="input-field input-email">
                        <span>Email: </span><input type="text" onChange={onEmailChange}/>
                    </div>
                    <div className="input-field input-password">
                        <span>Password: </span><input type="password" onChange={onPWChange}/>
                    </div>
                    <p className="warning-text">{errorMsg}</p>
                </div>
                <div className="button-container">
                    <div className="default-button" onClick={onVerifyManualSignIn}>Sign In</div>
                </div>
            </div>
            {props.children}
        </div>)
}

export default SignInUI