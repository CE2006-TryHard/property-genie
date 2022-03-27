import {useState } from "react"
import { userAuthMgr } from "../../controls/Mgr"
const RegisterUI = props => {
    const [pw, setPW] = useState('')
    const [confirmPW, setConfirmPW] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [emailWarningMsg, setEmailWarningMsg] = useState('')
    const [pwWarningMsg, setPWWarningMsg] = useState('')
    const [nameWarningMsg, setNameWarningMsg] = useState('')

    const {checkIsEmptyString, checkIsValidEmailFormat, validateAccountAvailability} = userAuthMgr
    const verifyEmail = () => {
        const isEmpty = checkIsEmptyString(email)
        const invalidEmail = !checkIsValidEmailFormat(email)
        if (isEmpty) setEmailWarningMsg('Please enter your email.')
        else if (invalidEmail) setEmailWarningMsg('You have enter an invalid email address!')
        return !isEmpty && !invalidEmail
    }
    const verifyPW = () => {
        if (pw !== confirmPW) setPWWarningMsg('Passwords do not match! Please reenter password.')
        else if (pw === '' || confirmPW === '') setPWWarningMsg('Please enter your password!')

        return (pw === confirmPW && pw !== '')
    }

    const verifyName = () => {
        const isEmptyFirstName = checkIsEmptyString(firstName)
        const isEmptyLastName = checkIsEmptyString(lastName)
        if (isEmptyFirstName) setNameWarningMsg('Please enter your first name!')
        else if(isEmptyLastName) setNameWarningMsg('Please enter your last name!')
        return (!isEmptyFirstName && !isEmptyLastName)
    }

    const onRegisterManual = () => {
        if (verifyEmail()) {
            setEmailWarningMsg('')
            validateAccountAvailability(email, userExist => {
                if (userExist) {
                    setEmailWarningMsg('Email already exists! Please enter a different email.')
                    return
                }

                if (verifyPW() && verifyName()) {
                    props.onRegisterManual({
                        name: firstName + ' ' + lastName,
                        email: email,
                        password: pw
                    })
                } else {
                    verifyPW()
                    verifyName()
                }
            })
        } else {
            verifyPW()
            verifyName()
        }
        
    }

    const onRegisterGoogle = () => {
        props.onRegisterGoogle()
    }

    const onEmailChange = e => {
        setEmail(e.target.value)
        setEmailWarningMsg('')
    }

    const onFirstNameCange = e => {
        setFirstName(e.target.value)
        setNameWarningMsg('')
    }

    const onLastNameChange = e => {
        setLastName(e.target.value)
        setNameWarningMsg('')
    }

    const onPWChange = e => {
        setPW(e.target.value)
        setPWWarningMsg('')
    }

    const onConfirmPWChange = e => {
        setConfirmPW(e.target.value)
        setPWWarningMsg('')
    }

    return (<div className="register-content">
            <button className="register-via-google-button" onClick={onRegisterGoogle}>Register via Google</button>
            <div>Or</div>
            <div className="input-field input-email">
                <span>Email: </span><input type="text" value={email} onChange={onEmailChange}/>
                <p className="warning">{emailWarningMsg}</p>
                {!checkIsEmptyString(email) && emailWarningMsg === '' ? <p className="approve">Email format is valid.</p> : ''}
            </div>
            <div className="input-field input-name">
                <div className="sub-input-field">
                    <span>First name: </span><input type="text" value={firstName} onChange={onFirstNameCange}/><br />
                </div>
                <div className="sub-input-field">
                <span>Last name:</span><input type="text" value={lastName} onChange={onLastNameChange}/>
                </div>
                <p className="warning">{nameWarningMsg}</p>
            </div>
            <div className="input-field input-password">
                <div className="sub-input-field">
                    <span>Password: </span><input type="text" value={pw} onChange={onPWChange}/><br />
                </div>
                <div className="sub-input-field">
                    <span>Confirm Password: </span><input type="text" value={confirmPW} onChange={onConfirmPWChange}/>
                </div>
                <p className="warning">{pwWarningMsg}</p>
            </div>
            <button onClick={onRegisterManual}>Register</button>
            <button onClick={props.onBack}>Back</button>
        </div>)
}

export default RegisterUI