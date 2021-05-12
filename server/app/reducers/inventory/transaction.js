import firebase from "firebase"

import {
//--> Item transaction
    ADD_TRX_ITEMS,
    REMOVE_TRX_ITEMS,
    DO_ITEMS_TRX
} from "../../actionTypes"

import {getDefaultFirestore} from "../../firebase/FireApp" 


const initTrxData = {
    transactions:{
        in:{
            page: 1,
            size: 20,
            list: [],
            onSnapshot: null,
            onFailed: null,
            unsubscriber: null
        },
        out:{
            page: 1,
            size: 20,
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


const filterValidTrxQueue = (trx, type)=>{
    const db = getDefaultFirestore();
    const queue = trx.list;
    let nameToStock = {};
    if(type == "out")
        (await db.collection('storage').get()).docs.forEach(
            doc=>{
                const item = doc.data() 
                nameToStock[item.name] = item.qty;
            }
        )
    const valid = queue.filter( rec=>{
                                    const item = rec.item.data()
                                    switch (type) {
                                        case "in":
                                            return true

                                        case "out":
                                            return nameToStock[item.name] ? nameToStock[item.name] - rec.qty >= 0 : false
                                    
                                        default:
                                            return false;
                                    }
                                })
    return valid.length > 0 ? valid : null
}



export const trxReducer = (state = initTrxData, action)=>{

    switch (action.type) {
        case ADD_TRX_ITEMS:
            const type = action.payload.type;
            const trx = getTrxFromState(state, type);
            const item = action.payload.item;
            const note = action.payload.note;
            const qty = action.payload.qty;
            trx.list.push( {item, note, qty} )
            return setTrxToState(state, trx, type);

        case REMOVE_TRX_ITEMS:
            const type = action.payload.type;
            const trx = getTrxFromState(state, type);
            const item = action.payload.item;
            trx.list = trx.list.filter( rec=> rec.item.data().uid != item.data().uid )
            return setTrxToState(state, trx, type);

        case DO_ITEMS_TRX:
            const type = action.payload.type;
            const trx = getTrxFromState(state, type);
            const onSuccess = action.payload.onSuccess;
            const onFailed = action.payload.onFailed;
            const queue = filterValidTrxQueue(trx, type);
            const db = getDefaultFirestore();
            if(queue)
                db.runTransaction( chain=>{
                    queue.forEach( rec=>{
                        let logColl = null;
                        let increment = null;
                        switch (type) {
                            case "in":
                                logColl = db.collection('logs/in')
                                increment = rec.qty;
                                break;
        
                            case "out":
                                logColl = db.collection('logs/out')
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