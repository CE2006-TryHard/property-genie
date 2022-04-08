import './RegisterUI.scss'
import {useState } from "react"
import { dbMgr, userAuthMgr } from "../../controls/Mgr"
import {GoogleSignInButton} from '../MiscUI/MiscUI'
import {useDispatch} from 'react-redux'
import { setLoadingState } from '../../../features/loadingStateSlice'

/**
 * @namespace RegisterUI
 * @description boundary module
 * @property {String} pw
 * @property {String} confirmPW
 * @property {String} email
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} emailWarningMsg
 * @property {String} pwWarningMsg
 * @property {String} nameWarningMsg
 */
const RegisterUI = props => {
    const dispatch = useDispatch()
    const [pw, setPW] = useState('')
    const [confirmPW, setConfirmPW] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [emailWarningMsg, setEmailWarningMsg] = useState('')
    const [pwWarningMsg, setPWWarningMsg] = useState('')
    const [nameWarningMsg, setNameWarningMsg] = useState('')

    const {checkIsEmptyString, checkIsValidEmailFormat} = userAuthMgr
    /**
     * @memberof RegisterUI
     * @typedef {function} verifyEmail
     * @return {Boolean}
     */
    const verifyEmail = () => {
        const isEmpty = checkIsEmptyString(email)
        const invalidEmail = !checkIsValidEmailFormat(email)
        if (isEmpty) setEmailWarningMsg('Please enter your email.')
        else if (invalidEmail) setEmailWarningMsg('Please enter a valid email.')
        return !isEmpty && !invalidEmail
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} verifyPW
     * @return {Boolean}
     */
    const verifyPW = () => {
        if (pw.length < 6) {
            setPWWarningMsg('Password should be at least 6 characters!')
        }
        else if (confirmPW === '') {
            setPWWarningMsg('Please confirm your password!')
        }
        else if (pw !== confirmPW) setPWWarningMsg('Passwords do not match!')
        return (pw === confirmPW && pw !== '' && pw.length >= 6)
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} verifyName
     * @return {Boolean}
     */
    const verifyName = () => {
        const isEmptyFirstName = checkIsEmptyString(firstName)
        const isEmptyLastName = checkIsEmptyString(lastName)
        if (isEmptyFirstName) setNameWarningMsg('Please enter your first name!')
        else if(isEmptyLastName) setNameWarningMsg('Please enter your last name!')
        return (!isEmptyFirstName && !isEmptyLastName)
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onVerifyManualRegister
     */
    const onVerifyManualRegister = () => {
        setEmailWarningMsg('')
        if (!verifyEmail()) return
            
        if (verifyName() && verifyPW()) {
            dispatch(setLoadingState(3))
            userAuthMgr.sendRegisterEmail(email, pw, (success, err) => {
                dispatch(setLoadingState(0))
                if (success) {
                    console.log('sign up link successfully sent')
                    const id = email.replace('.', '-')
                    dbMgr.updateDataDB(`account/${id}/name`, firstName + ' ' + lastName)
                } else {
                    switch (err.code) {
                        case 'auth/email-already-in-use':
                            setEmailWarningMsg("Email already exists! Please enter a different email.")
                            // console.log('account exist!')
                            break;
                        case 'auth/weak-password':
                            setPWWarningMsg('Password should be at least 6 characters!')
                            break
                        default:
                            console.log('error on manual sign up', err)
                            break
                    }
                    
                }
            })
        }
        
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onGoogleSignUp
     */
    const onGoogleSignUp = () => {
        dispatch(setLoadingState(3))
        userAuthMgr.googleSignIn((success, errCode) => {
            dispatch(setLoadingState(0))
            if (!success) {
                switch (errCode) {
                    case 'auth/popup-closed-by-user':
                        break
                    default:
                        console.log(errCode)
                        break
                }
            }
        })
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onEmailChange
     * @param {Event} e
     */
    const onEmailChange = e => {
        setEmail(e.target.value)
        setEmailWarningMsg('')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onFirstNameCange
     * @param {Event} e
     */
    const onFirstNameCange = e => {
        setFirstName(e.target.value)
        setNameWarningMsg('')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onLastNameChange
     * @param {Event} e
     */
    const onLastNameChange = e => {
        setLastName(e.target.value)
        setNameWarningMsg('')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onPWChange
     * @param {Event} e
     */
    const onPWChange = e => {
        setPW(e.target.value)
        setPWWarningMsg('')
    }

    /**
     * @memberof RegisterUI
     * @typedef {function} onConfirmPWChange
     * @param {Event} e
     */
    const onConfirmPWChange = e => {
        setConfirmPW(e.target.value)
        setPWWarningMsg('')
    }

    return (<div className="register-container">
        <div className="google-button-container">
            <p className="google-sign-in-info">To skip email verification,<br />sign in/sign up with Google.</p>
            <GoogleSignInButton onClick={onGoogleSignUp} label="Sign up with google"></GoogleSignInButton>
        </div>
        <p className="or-text"><b>Or</b></p>
        <div className="input-field-container">
            <div className="input-field input-email">
                <span>Email: </span><input type="text" value={email} onChange={onEmailChange}/>
            </div>
            <p className="warning">{emailWarningMsg}</p>

            <div className="input-field input-name">
                <span>First name: </span><input type="text" value={firstName} onChange={onFirstNameCange}/>   
            </div>
            <div className="input-field input-name">
                <span>Last name:</span><input type="text" value={lastName} onChange={onLastNameChange}/>
            </div>
            <p className="warning">{nameWarningMsg}</p>

            <div className="input-field input-password">
                <span>Password: </span><input type="password" value={pw} onChange={onPWChange}/>
            </div>
            <div className="input-field input-password">
                <span>Confirm Password: </span><input type="password" value={confirmPW} onChange={onConfirmPWChange}/>
            </div>
            <p className="warning">{pwWarningMsg}</p>

        </div>
        <div className="button-container">
            <div onClick={onVerifyManualRegister}>Sign Up</div>
            <div onClick={props.onBack}>Back</div>
        </div>
        
    </div>)
}

export default RegisterUI