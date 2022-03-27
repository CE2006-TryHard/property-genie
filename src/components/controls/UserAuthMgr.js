import { dbMgr } from "./Mgr";

export default class UserAuthMgr {
    validateAccountAvailability(userInfo, onFetchEnd) {
        // dbMgr
    }

    validateIfAccountExist(userInfo, onFetchEnd) {
        
    }

    checkIsValidEmailFormat (email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }

    checkIsEmptyString(str) {
        return str.trim() === ''
    }

    updateUserPW(pw) {
        // dbMgr
    }
}