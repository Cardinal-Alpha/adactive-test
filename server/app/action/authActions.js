
import {SET_LOGIN,
    SET_REGISTRATION,
    DO_LOGIN,
    DO_REGISTRATION,
    DO_LOGOUT,
    VERIFY_EMAIL_CODE,
    SEND_EMAIL_VERIFICATION,
    SET_AUTHORIZED
} from "../actionTypes"



export const setLogin = (email, password)=> ({
    type: SET_LOGIN,
    payload: {
        email,
        password
    }
})

export const doLogin = (onSuccess, onFailed)=> ({
    type: DO_LOGIN,
    payload: {
        onSuccess,
        onFailed
    }
})

export const setRegistration = (displayName, email, password)=> ({
    type: SET_REGISTRATION,
    payload:{
        displayName,
        email,
        password
    }
})

export const doRegistration = (onSuccess, onFailed)=> ({
    type: DO_REGISTRATION,
    payload: {
        onSuccess,
        onFailed
    }
})

export const sendVerificationEmail = (onSuccess, onFailed)=> ({
    type: SEND_EMAIL_VERIFICATION,
    payload: {
        onSuccess,
        onFailed
    }
})

export const verifyEmailCode = (code, onSuccess, onFailed)=> ({
    type: VERIFY_EMAIL_CODE,
    payload: {
        code,
        onSuccess,
        onFailed
    }
})

export const doLogout = (onSuccess, onFailed)=> ({
    type: DO_LOGOUT,
    payload: {
        onSuccess,
        onFailed
    }
})


export const setAuthorized = isAuthorized=>({
    type: SET_AUTHORIZED,
    payload: isAuthorized
})