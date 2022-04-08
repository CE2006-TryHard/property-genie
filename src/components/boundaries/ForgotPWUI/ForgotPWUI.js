import './ForgotPWUI.scss'
import { useState } from "react"
import {useDispatch} from 'react-redux'
import { setLoadingState } from '../../../features'
import { userAuthMgr } from "../../controls/Mgr"

const ForgotPasswordUI = props => {
    console.log('render forgot password ui')
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [showSuccessText, setShowSuccessText] = useState(false)
    const onChange = e => {
        setEmail(e.target.value)
        setErrorMsg('')
    }

    const onSubmitResetPassword = () => {
        if (!userAuthMgr.checkIsValidEmailFormat(email)) {
            setErrorMsg('Please enter a valid email.')
        } else {
            setErrorMsg('')
            dispatch(setLoadingState(3))
            userAuthMgr.requestPasswordChange(email, (success, errCode) => {
                if (success) {
                    setShowSuccessText(true)
                } else {
                    switch(errCode) {
                        case 'auth/user-not-found':
                            setErrorMsg('Email does not exist!')
                        break;
                        default:
                            console.log(errCode)
                            break
                    }
                }
                dispatch(setLoadingState(0))
            })
        }
    }

    return (<div className="forgot-password-container">
        <h3>Reset password</h3>
        {showSuccessText ? `Request submitted. A password reset link will be sent to ${email}.` : <div className="input-field-container">
            <div className="input-field">
            <span>Email: </span><input type="text" onChange={onChange} />
            </div>
            <p className="warning-text">{errorMsg}</p>
        </div>}
        {showSuccessText ? '' : <div className="button-container">
            <div className="default-button" onClick={onSubmitResetPassword}>Submit</div>
            <div className="default-button" onClick={props.onBack}>Cancel</div>
        </div>}
        {showSuccessText ? <div className="button-container">
            <div className="default-button" onClick={props.onBack}>Back</div>
        </div> : ''}
    </div>)
}

export default ForgotPasswordUI
