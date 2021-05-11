
import firebase from "firebase"

import DefaultConfig from './adactive-test-firebase-config.json'


const getDefaultApp = ()=>{
    try{
        return firebase.app();
    }catch(e){
        return firebase.initializeApp(DefaultConfig);
    }
}

export const getDefaultAuth = ()=>{
    const auth = getDefaultApp().auth();
    return new Promise(
        (resolve, reject)=>{
            if(typeof window != 'undefined'){
                auth.setPersistence(
                    firebase.auth.Auth.Persistence.LOCAL
                )
                .then( ()=> resolve(auth) )
                .catch( err=> reject(err))
            }else{
                resolve(null);
            }
        }
    )
}