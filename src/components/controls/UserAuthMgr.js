import { 
        getAuth,
        GoogleAuthProvider,
        signInWithPopup,
        signInWithEmailAndPassword,
        signOut,
        createUserWithEmailAndPassword,
        sendEmailVerification, 
        sendPasswordResetEmail 
    } from "firebase/auth"

const provider = new GoogleAuthProvider()
provider.addScope('email')
provider.setCustomParameters({
    prompt: 'select_account'
})

const URL_PREFIX = process.env.NODE_ENV === 'production' ? 'https://tryhard-web-app.web.app/' : `http://localhost:3000`

/**
 * A control class manage operation related to user account authentication
 */
class UserAuthMgr {
    constructor () {
        /** @public */
        this.userAuthInfo = null
    }

    /**
     * Set current active user auth info when authentication status changed
     * @param {Object} newUserAuthInfo 
     */
    setAuthUserInfo(newUserAuthInfo) {
        this.userAuthInfo = newUserAuthInfo
    }

    /**
     * requset to firebase/auth to create new user account by given email and password
     * @param {String} email 
     * @param {String} password 
     * @param {function} onFetchEnd 
     */
    sendRegisterEmail (email, password, onFetchEnd) {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, password)
          .then((userData) => {
              console.log('sign up successfully', userData)
              this.setAuthUserInfo(userData.user)
              this.sendEmailVerificationRequest(onFetchEnd)
          })
          .catch(err => onFetchEnd(false, err))
    }

    /**
     * send email verification link to user
     * @param {function} onFetchEnd 
     */
    sendEmailVerificationRequest(onFetchEnd) {
        const actionCodeSettings = {
            url: URL_PREFIX + '',
            handleCodeInApp: true
          }
          sendEmailVerification(this.userAuthInfo, actionCodeSettings)
            .then(() => {
                // console.log('email verification request sent')
                if (onFetchEnd) onFetchEnd(true)
            }).catch(err => {
                if (onFetchEnd) onFetchEnd(false, err.code)
            })
    }

    /**
     * send password reset link to user's email
     * @param {String} email 
     * @param {function} onFetchEnd 
     */
    requestPasswordChange (email, onFetchEnd) {
        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: URL_PREFIX,
            // url: URL_PREFIX + '/sign-in',
            // This must be true.
            handleCodeInApp: true
          }
        const auth = getAuth()
        sendPasswordResetEmail(auth, email, actionCodeSettings)
            .then(() => {
                if (onFetchEnd) onFetchEnd(true)
                // console.log('reset password sent')
            })
            .catch(err => {
                if (onFetchEnd) onFetchEnd(false, err.code)
                // console.log('error on request password change', err)
            })
    }

    /**
     * invoke pop up panel contain google sign in option
     */
    googleSignIn (onFetchEnd) {
        const auth = getAuth()
        signInWithPopup(auth, provider)
        .then(userCredential => {
            if (onFetchEnd) onFetchEnd(true)
            console.log('google sign in successfully', userCredential)
        }).catch(err => {
            if (onFetchEnd) onFetchEnd(false, err.code)
            console.log('error on sign in', err)
        })
    }

    /**
     * requset to firebase/auth to verify user credential via email and password
     * @param {String} email 
     * @param {String} password 
     * @param {function} onFetchEnd 
     */
    emailPasswordSignIn (email, password, onFetchEnd) {
        const auth = getAuth()
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                console.log('manual sign in successfully', userCredential)
                onFetchEnd(true)
            }).catch(err => {
                onFetchEnd(false, err.code)
            })
    }

    /**
     * invoke firebase/auth to sign out user
     */
    generalSignOut (callback) {
        const auth = getAuth()
        signOut(auth)
            .then(() => {
                console.log('sign out successfully')
                callback(true)
            }).catch(err =>{
             console.log('error on sign out', err)
             callback(false, err)
            })
    }

    /**
     * @param  {String} email
     * @description check if a email address format is valid
     * @return {Boolean}
     */
    checkIsValidEmailFormat (email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }

    /**
     * 
     * @param {String} str 
     * @returns {Boolean}
     * @description check if a string is empty
     */
    checkIsEmptyString(str) {
        return str.trim() === ''
    }

    /**
     * 
     * @param {String} pw 
     * @description update user password to database
     */
    updateUserPW(pw) {
        // dbMgr
    }
}

export default UserAuthMgr
