import {
//--> Storage item catalog
    ADD_STORAGE_ITEM,
    REMOVE_STORAGE_ITEM,
//--> Storage status
    SUBSCRIBE_STORAGE,
    FETCH_STORAGE,
    SET_STORAGE_SEARCHTERM,
//--> Item transaction
    ADD_TRX_ITEMS,
    REMOVE_TRX_ITEMS,
    DO_ITEMS_TRX,
//-- Transaction log
    SUBSCRIBE_TRX,
    FETCH_TRX,
    SET_TRX_RANGE,
} from "../actionTypes"



export const subscribeStorage = (onFetch, onFailed)=> ({
    type: SUBSCRIBE_STORAGE,
    payload:{
        onFetch,
        onFailed
    }
})


export const fetchStorage = ()=> ({
    type: FETCH_STORAGE
})


export const setStorageSearchTerm = term=> ({
    type: SET_STORAGE_SEARCHTERM,
    payload: term
})


export const addTransactionItem = (item, qty, note, type)=> ({
    type: ADD_TRX_ITEMS,
    payload:{
        item,
        qty,
        note,
        type
    }
})


export const removeTransactionItem = (item, type)=> ({
    type: REMOVE_TRX_ITEMS,
    payload: {
        item,
        type
    }
})


export const doItemTransaction = (onSuccess, onFailed, type)=> ({
    type: DO_ITEMS_TRX,
    payload:{
        onSuccess,
        onFailed,
        type
    }
})


export const subscribeTransaction = (onFetch, onFailed, type)=> ({
    type: SUBSCRIBE_TRX,
    payload:{
        onFetch,
        onFailed,
        type
    }
})


export const fetchTransaction = type=> ({
    type: FETCH_TRX,
    payload: type
})


export const setTransactionRange = (start, end, type)=> ({
    type: SET_TRX_RANGE,
    payload:{
        start,
        end,
        type
    }
})


export const addItemToCatalog = (name, price, onSuccess, onFailed)=> ({
    type: ADD_STORAGE_ITEM,
    payload:{
        name,
        price,
        onSuccess,
        onFailed
    }
})


export const removeItemFromCatalog = (name, onSuccess, onFailed)=> ({
    type: REMOVE_STORAGE_ITEM,
    payload: {
        name,
        onSuccess,
        onFailed
    }
})
