
import {SET_LOGIN,
        SET_REGISTRATION,
        DO_LOGIN,
        DO_REGISTRATION,
        LOGOUT
} from "../actionTypes"

import {getDefaultApp} from "../firebase/FireApp"


const initAuth = {
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
    
    const auth = getDefaultApp().auth();

    switch (action.type) {

        case SET_LOGIN:{
            return {
                ...state,
                login: action.payload
            }
        }
        
        case DO_LOGIN:{
            auth.signInWithEmailAndPassword(
                state.login.email,
                state.login.password
            )
            .then( creds=> action.payload.onSuccess(creds))
            .catch( err=> action.payload.onFailed(err))
            return {
                ...state,
                login:{
                    email: "",
                    password: ""
                }
            }
        }

        case SET_REGISTRATION:{
            return {
                ...state,
                registration: action.payload
            }
        }
        
        case DO_REGISTRATION:{
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
            return {
                ...state,
                registration:{
                    displayName: "",
                    email: "",
                    password: ""
                }
            }
        }

        case LOGOUT: {
            auth.signOut()
            .then( ()=> action.payload.onSuccess() )
            .catch( err=> action.payload.onFailed(err) )
            return {
                ...state,
                ...initAuth
            };
        }

        default:
            return {
                ...state,
                ...initAuth
            };
    }
}

export default authReducers;