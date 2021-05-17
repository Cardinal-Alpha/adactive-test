import {
//-- Transaction log
    SUBSCRIBE_TRX,
    FETCH_TRX,
    SET_TRX_RANGE,
} from "../../actionTypes"

import {getDefaultFirestore} from "../../firebase/FireApp" 


const initLogsData = {
    logs:{
        in:{
            range:{
                start: null,
                end: null
            },
            onFetch: null,
            onFailed: null
        },
        out:{
            range:{
                start: null,
                end: null
            },
            onFetch: null,
            onFailed: null
        }
    }
}


const execQuery = (logs, type) => {
    const db = getDefaultFirestore();
    const range = logs.range;
    const onFetch = logs.onFetch;
    const onFailed = logs.onFailed;
    let query = null;
    switch (type) {
        case "in":
            query = db.collection('logs').doc('in').collection('records')
            break;
        case "out":
            query = db.collection('logs').doc('out').collection('records')
            break;
    }
    if(query && onFetch)
        query.get().then(
            snapshot=>{
                const list = snapshot.docs.filter( 
                                            doc=> range.start? doc.data().timestamp >= range.start : true
                                        ).filter(
                                            doc=> range.end? doc.data().timestamp < range.end : true
                                        );
                if(onFetch)
                    onFetch(list);
            })
            .catch(err=>{
                if(onFailed)
                    onFailed(err);
            })
    return logs;
}


const getLogFromState = (state, type)=>{
    switch (type) {
        case "in":
            return state.logs.in
    
        case "out":
            return state.logs.out
        
        default:
            return null;
    }
}


const setLogToState = (state, log, type)=>{
    switch (type) {
        case "in":
            state.logs.in = log
            break;
    
        case "out":
            state.logs.out = log
            break;
    }
    return {...state};
}


export const logsReducer = (state = initLogsData, action)=>{
    const type = action.payload? action.payload.type : null;
    const log = getLogFromState(state, type);
    switch (action.type) {
        case SET_TRX_RANGE:
            if(log){
                const range = action.payload;
                delete range.type;
                log.range = range;
                return setLogToState(state, execQuery(log, type), type);
            }
            return state;


        case SUBSCRIBE_TRX: 
            if(log){
                log.onFetch = action.payload.onFetch;
                log.onFailed = action.payload.onFailed;
                return setLogToState(state, log, type);
            }
            return state;


        case FETCH_TRX:
            if(log){
                return setLogToState(state, execQuery(log, type), type);
            }
            return state;


        default:
            return state;
    }
}