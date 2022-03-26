import React from 'react'
import { useGoogleLogin } from 'react-use-googlelogin'

const GoogleAuthContext = React.createContext()
const GoogleAuthProvider = ({children}) => {
    const googleAuth = useGoogleLogin({
        clientId: "750566440817-smpcs1rgb0tv6eavcq2amcih72ln2sj3.apps.googleusercontent.com",
        fetchBasicProfile: true
    })

    return (<GoogleAuthContext.Provider value={googleAuth}>
        {children}
    </GoogleAuthContext.Provider>)
}

const useGoogleAuth = () => React.useContext(GoogleAuthContext)



export {GoogleAuthProvider, useGoogleAuth}
