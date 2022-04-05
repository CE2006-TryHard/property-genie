import React, { useEffect, useState } from "react"
import {getAuth} from "firebase/auth"
import { userAuthMgr } from "./Mgr"

const AuthContext = React.createContext()

const AuthProvider = ({children}) => {
    const [isInitialized, setIsInitialized] = useState(false)
    const [authUserInfo, setAuthUserInfo] = useState(null)

    useEffect(() => { // to ensure auth state changed only get registered once
        const auth = getAuth()
        // signOut(auth)
        auth.onAuthStateChanged(user => {
            if (user) {
                const {email, displayName: name, providerId} = user.providerData[0]
                const {emailVerified} = user
                const isGoogleAuth = providerId === 'google.com'
                userAuthMgr.setAuthUserInfo(user)
                console.log('check from firebase', user)
                setAuthUserInfo({name, email, emailVerified: emailVerified || isGoogleAuth, isGoogleAuth})
                
            } else {
                console.log('no active user')
            }
            setIsInitialized(true)
            
            // console.log('auth state change check', user)
        })
    }, [])

    return <AuthContext.Provider value={{authUserInfo, isInitialized}}>
        {children}
    </AuthContext.Provider>
}

const useFirebaseAuth = () => React.useContext(AuthContext)

export {AuthProvider, useFirebaseAuth}
