
import {SET_LOGIN,
        SET_REGISTRATION,
        DO_LOGIN,
        DO_REGISTRATION,
        DO_LOGOUT,
        SET_AUTHORIZED
} from "../actionTypes"

import {getDefaultAuth} from "../firebase/FireApp"


const initAuth = {
    isAuthorized: false,
    login:{
        email: "",
        password: ""
    },
    registration:{
        displayName: "",
        email: "",
        password: ""
    }
}


const authReducers = (state = initAuth, action)=>{

    switch (action.type) {

        case SET_LOGIN:
            return {
                ...state,
                login: action.payload
            }
        
        case DO_LOGIN:
            getDefaultAuth()
            .then(
                auth =>
                    auth.signInWithEmailAndPassword(
                        state.login.email,
                        state.login.password
                    )
                    .then( creds=> action.payload.onSuccess(creds))
                    .catch( err=> action.payload.onFailed(err))
            )
            return {
                ...state,
                login:{
                    email: "",
                    password: ""
                }
            }

        case SET_REGISTRATION:
            return {
                ...state,
                registration: action.payload
            }
        
        case DO_REGISTRATION:
            getDefaultAuth()
            .then(
                auth =>
                    auth.createUserWithEmailAndPassword(
                        state.registration.email,
                        state.registration.password
                    )
                    .then( creds=>{
                        const displayName = state.registration.displayName
                        creds.user.updateProfile({displayName})
                        .then( ()=> action.payload.onSuccess(creds));
                    })
                    .catch( err=> action.payload.onFailed(err))
            )
            return {
                ...state,
                registration:{
                    displayName: "",
                    email: "",
                    password: ""
                }
            }

        case DO_LOGOUT:
            getDefaultAuth()
            .then(
                auth =>
                    auth.signOut()
                    .then( ()=> action.payload.onSuccess() )
                    .catch( err=> action.payload.onFailed(err) )
            )
            return {
                ...state,
                ...initAuth
            };

        case SET_AUTHORIZED:
            return {
                ...state,
                isAuthorized: action.payload
            }

        default:
            return state;
    }
}

export default authReducers;