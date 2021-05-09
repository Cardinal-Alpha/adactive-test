
import firebase from "firebase"

import DefaultConfig from './adactive-test-firebase-config.json'


export const getDefaultApp = ()=>{
    try{
        return firebase.initializeApp(DefaultConfig);
    }catch(e){
        return firebase.app();
    }
}