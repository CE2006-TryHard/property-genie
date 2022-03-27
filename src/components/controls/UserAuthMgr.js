// import { dbMgr } from "./Mgr"

/**
 * A control class manage operation related to user account authentication
 */
class UserAuthMgr {
    /**
     * @param  {Object} userInfo
     * @param  {function} onFetchEnd callback function to be invoked once database query completed
     * @description validate if a provided user information is not yet exist in the database
     */
    validateAccountAvailability(userInfo, onFetchEnd) {
        // dbMgr
    }

    /**
     * 
     * @param {Object} userInfo 
     * @param {function} onFetchEnd callback function to be invoked once database query completed
     * @description validate if a provided user information exists in the database
     */
    validateIfAccountExist(userInfo, onFetchEnd) {
        
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
