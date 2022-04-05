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
        this.userAuthInfo = null
    }

    setAuthUserInfo(newUserAuthInfo) {
        this.userAuthInfo = newUserAuthInfo
    }

    sendRegisterEmail ({email, password}, onFetchEnd) {
        const auth = getAuth()
        createUserWithEmailAndPassword(auth, email, password)
          .then((userData) => {
              console.log('sign up successfully', userData)
              this.setAuthUserInfo(userData.user)
              this.sendEmailVerificationRequest(onFetchEnd)
          }).bind(this)
          .catch(err => onFetchEnd(false, err))
    }

    sendEmailVerificationRequest(onFetchEnd) {
        const actionCodeSettings = {
            url: URL_PREFIX + '/sign-in',
            handleCodeInApp: true
          }
          sendEmailVerification(this.userAuthInfo, actionCodeSettings)
            .then(() => {
                console.log('email verification request sent')
                onFetchEnd(true)
            }).catch(err => onFetchEnd(false, err))
    }

    requestPasswordChange (email, onFetchEnd) {
        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: URL_PREFIX + '/sign-in',
            // This must be true.
            handleCodeInApp: true
          }
        const auth = getAuth()
        sendPasswordResetEmail(auth, email, actionCodeSettings)
            .then(() => {
                onFetchEnd(true)
            })
            .catch(err => console.log('error on request password change', err))
    }

    googleSignIn () {
        console.log('check')
        const auth = getAuth()
        signInWithPopup(auth, provider)
        .then(results => {
            console.log(results)
            console.log('google sign in done')
        })
    }

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

    generalSignOut () {
        const auth = getAuth()
        signOut(auth)
            .then(() => {
                console.log('sign out successfully')
            }).catch(err =>{
             console.log('error on sign out', err)
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
