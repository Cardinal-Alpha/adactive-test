import {
//-- Transaction log
    SUBSCRIBE_TRX_SNAPSHOT,
    UNSUBSCRIBE_TRX_SNAPSHOT,
    SET_TRX_PAGE,
    SET_TRX_RANGE,
} from "../../actionTypes"

import {getDefaultFirestore} from "../../firebase/FireApp" 


const initLogsData = {
    logs:{
        in:{
            page: 1,
            size: 20,
            range:{
                start: null,
                end: null
            },
            onSnapshot: null,
            onFailed: null,
            unsubscriber: null
        },
        out:{
            page: 1,
            size: 20,
            range:{
                start: null,
                end: null
            },
            onSnapshot: null,
            onFailed: null,
            unsubscriber: null
        }
    }
}


const setQueryToLog = (logs, type) => {
    const db = getDefaultFirestore();
    const page = logs.page;
    const size = logs.size;
    const range = logs.range;
    const onSnap = logs.onSnapshot;
    const onFailed = logs.onFailed;
    let query = null;
    if(logs.unsubscriber)
        logs.unsubscriber();
    switch (type) {
        case "in":
            query = db.collection('logs/in')
            break;
        case "out":
            query = db.collection('logs/out')
            break;
    }
    if(page && size && query && onSnap)
        logs.unsubscriber = query.onSnapshot(
            snapshot=>{
                const list = snapshot.docs.filter( 
                                            doc=> range.start? doc.data().timestamp >= range.start : true
                                        ).filter(
                                            doc=> range.end? doc.data().timestamp < range.end : true
                                        );
                const offset = (page-1)*size;
                if(onSnap)
                    onSnap( list.slice( offset, offset + size) );
            },
            err=>{
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
    return state;
}


export const logsReducer = (state = initLogsData, action)=>{

    switch (action.type) {
        case SET_TRX_RANGE:
            const log = getLogFromState(state, action.payload.type);
            const type = action.payload.type;
            if(log){
                const range = action.payload;
                delete range.type;
                log.range = range;
                return setLogToState(state, setQueryToLog(log, type), type);
            }
            return state;


        case SET_TRX_PAGE: 
            const log = getLogFromState(state, action.payload.type);
            const type = action.payload.type;
            if(log){
                log.page = action.payload.page;
                log.size = action.payload.size;
                return setLogToState(state, setQueryToLog(log, type), type);
            }
            return state;


        case SUBSCRIBE_TRX_SNAPSHOT: 
            const log = getLogFromState(state, action.payload.type);
            const type = action.payload.type;
            if(log){
                log.onSnapshot = action.payload.onSnapshot;
                log.onFailed = action.payload.onFailed;
                return setLogToState(state, setQueryToLog(log, type), type);
            }
            return state;


        case UNSUBSCRIBE_TRX_SNAPSHOT:
            const log = getLogFromState(state, action.payload.type);
            const type = action.payload.type;
            if(log){
                if(log.unsubscriber)
                    log.unsubscriber();
                log.onSnapshot = null;
                log.onFailed = null;
                log.unsubscriber = null;
                return setLogToState(state, log, type);
            }
            return state;


        default:
            return state;
    }
}