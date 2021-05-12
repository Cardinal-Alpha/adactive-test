import firebase from "firebase"
import {
    //--> Storage item catalog
        ADD_STORAGE_ITEM,
        REMOVE_STORAGE_ITEM
} from "../../actionTypes"


import {getDefaultFirestore} from "../../firebase/FireApp"


export const catalogReducer = (state = {}, action)=> {
    const db = getDefaultFirestore();
    const onSuccess = action.payload.onSuccess;
    const onFailed = action.payload.onFailed;
    switch (action.type) {
        case ADD_STORAGE_ITEM:
            const name = action.payload.name;
            const price = action.payload.price;
            db.collection('storage').add({
                name,
                price,
                qty: 0,
                last_update: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then( ()=> {
                if(onSuccess)
                    onSuccess();
            })
            .catch(err=> {
                if(onFailed)
                    onFailed(err);
            })
            break;
    
        case REMOVE_STORAGE_ITEM:
            const name = action.payload.name;
            db.collection('storage').where("name", "==", name)
            .get()
            .then( docs=> {
                docs.forEach( doc=> doc.ref.delete() );
                if(onSuccess)
                    onSuccess();
            })
            .catch(err=> {
                if(onFailed)
                    onFailed(err);
            })
            break;
    }
    
    return state
}