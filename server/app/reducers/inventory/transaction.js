import firebase from "firebase"

import {
//--> Item transaction
    ADD_TRX_ITEMS,
    REMOVE_TRX_ITEMS,
    UPDATE_TRX_ITEMS,
    DO_ITEMS_TRX
} from "../../actionTypes"

import {getDefaultFirestore} from "../../firebase/FireApp" 


const initTrxData = {
    transactions:{
        in:{
            list: [],
            onSnapshot: null,
            onFailed: null,
            unsubscriber: null
        },
        out:{
            list: [],
            onSnapshot: null,
            onFailed: null,
            unsubscriber: null
        }
    }
}


const getTrxFromState = (state, type)=>{
    switch (type) {
        case "in":
            return state.transactions.in
    
        case "out":
            return state.transactions.out
        
        default:
            return null;
    }
}


const setTrxToState = (state, trx, type)=>{
    switch (type) {
        case "in":
            state.transactions.in = trx
            break;
    
        case "out":
            state.transactions.out = trx
            break;
    }
    return state;
}



export const trxReducer = (state = initTrxData, action)=>{
    const type = action.payload? action.payload.type : null;
    const trx = getTrxFromState(state, type);
    const item = action.payload? action.payload.item : null;
    switch (action.type) {
        case ADD_TRX_ITEMS:
            const note = action.payload.note;
            const qty = action.payload.qty;
            trx.list.push( {item, note, qty} )
            return setTrxToState(state, trx, type);

        case REMOVE_TRX_ITEMS:
            trx.list = trx.list.filter( rec=> rec.item.data().uid != item.data().uid )
            return setTrxToState(state, trx, type);

        case UPDATE_TRX_ITEMS:
            const uNote = action.payload.note;
            const uQty = action.payload.qty;
            trx.list = trx.list.map( rec=> {
                if(rec.item.data().uid == item.data().uid)
                    return {
                        item,
                        note: uNote,
                        qty: uQty
                    }
                return rec;
            })
            return setTrxToState(state, trx, type);

        case DO_ITEMS_TRX:
            const onSuccess = action.payload.onSuccess;
            const onFailed = action.payload.onFailed;
            const db = getDefaultFirestore();
            db.runTransaction( chain=>{
                trx.list.forEach( rec=>{
                    let logColl = null;
                    let increment = null;
                    switch (type) {
                        case "in":
                            logColl = db.collection('logs').doc('in').collection('records')
                            increment = rec.qty;
                            break;
    
                        case "out":
                            logColl = db.collection('logs').doc('out').collection('records')
                            increment = 0 - rec.qty;
                            break;
                    }
                    const item = rec.item;
                    const newLog = logColl.doc();
                    chain.update(
                        item,
                        {
                            qty: firebase.firestore.FieldValue.increment(increment),
                            last_update: firebase.firestore.FieldValue.serverTimestamp()
                        }
                    ).set(
                        newLog,
                        {
                            name: rec.item.data().name,
                            qty: rec.qty,
                            sum: rec.item.data().price * rec.qty,
                            note: rec.note,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        }
                    )
                })
                return chain;
            })
            .then(()=>{
                if(onSuccess)
                    onSuccess();
            })
            .catch( err=>{
                if(onFailed)
                    onFailed(err);
            })
            switch (type) {
                case "in":
                    trx.in.list = []
                    break;
            
                case "out":
                    trx.out.list = []
                    break;
            }
            return setTrxToState(state, trx, type);


        default:
            return state;
    }
}