import {useState } from "react"
import { dbMgr } from "../../controls/Mgr"
const RegisterUI = props => {
    const [pw, setPW] = useState('')
    const [confirmPW, setConfirmPW] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [emailWarning, setEmailWarning] = useState('')
    const [pwWarning, setPWWarning] = useState('')
    const [nameWarning, setNameWarning] = useState('')

    const verifyEmail = () => {
        const isEmpty = email.trim() === ''
        const invalidEmail = !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
        if (isEmpty) setEmailWarning('Please enter your email.')
        else if (invalidEmail) setEmailWarning('You have enter an invalid email address!')
        return !isEmpty && !invalidEmail
    }
    const verifyPW = () => {
        if (pw !== confirmPW) setPWWarning('Passwords do not match! Please reenter password.')
        else if (pw === '' || confirmPW === '') setPWWarning('Please enter your password!')

        return (pw === confirmPW && pw !== '')
    }

    const verifyName = () => {
        if (firstName.trim() === '') setNameWarning('Please enter your first name!')
        else if(lastName.trim() === '') setNameWarning('Please enter your last name!')
        return (firstName.trim() !== '' && lastName.trim() !== '')
    }

    const onRegisterManual = () => {
        if (verifyEmail()) {
            setEmailWarning('')
            dbMgr.getUserData(email, userData => {
                if (userData) {
                    setEmailWarning('Email already exists! Please enter a different email.')
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

    const onEmailChange = e => {
        setEmail(e.target.value)
        setEmailWarning('')
    }

    const onFirstNameCange = e => {
        setFirstName(e.target.value)
        setNameWarning('')
    }

    const onLastNameChange = e => {
        setLastName(e.target.value)
        setNameWarning('')
    }

    const onPWChange = e => {
        setPW(e.target.value)
        setPWWarning('')
    }

    const onConfirmPWChange = e => {
        setConfirmPW(e.target.value)
        setPWWarning('')
    }

    return (<div className="register-content">
            <button className="register-via-google-button" onClick={props.onRegisterGoogle}>Register via Google</button>
            <div>Or</div>
            <div className="input-field input-email">
                <span>Email: </span><input type="text" value={email} onChange={onEmailChange}/>
                <p className="warning">{emailWarning}</p>
                {email.trim() !== '' && emailWarning === '' ? <p className="approve">Email format is valid.</p> : ''}
            </div>
            <div className="input-field input-name">
                <div className="sub-input-field">
                    <span>First name: </span><input type="text" value={firstName} onChange={onFirstNameCange}/><br />
                </div>
                <div className="sub-input-field">
                <span>Last name:</span><input type="text" value={lastName} onChange={onLastNameChange}/>
                </div>
                <p className="warning">{nameWarning}</p>
            </div>
            <div className="input-field input-password">
                <div className="sub-input-field">
                    <span>Password: </span><input type="text" value={pw} onChange={onPWChange}/><br />
                </div>
                <div className="sub-input-field">
                    <span>Confirm Password: </span><input type="text" value={confirmPW} onChange={onConfirmPWChange}/>
                </div>
                <p className="warning">{pwWarning}</p>
            </div>
            <button onClick={onRegisterManual}>Register</button>
            <button onClick={props.onBack}>Back</button>
        </div>)
}

export default RegisterUI