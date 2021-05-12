import {
//--> Storage item catalog
    ADD_STORAGE_ITEM,
    REMOVE_STORAGE_ITEM,
//--> Storage status
    SUBSCRIBE_STORAGE_SNAPSHOT,
    UNSUBSCRIBE_STORAGE_SNAPSHOT,
    SET_STORAGE_SEARCHTERM,
    SET_STORAGE_PAGE,
//--> Item transaction
    ADD_TRX_ITEMS,
    REMOVE_TRX_ITEMS,
    DO_ITEMS_TRX,
//-- Transaction log
    SUBSCRIBE_TRX_SNAPSHOT,
    UNSUBSCRIBE_TRX_SNAPSHOT,
    SET_TRX_RANGE,
    SET_TRX_PAGE
} from "../actionTypes"



export const subscribeStorageSnapshot = (onSnapshot, onFailed)=> ({
    type: SUBSCRIBE_STORAGE_SNAPSHOT,
    payload:{
        onSnapshot,
        onFailed
    }
})


export const unsubscribeStorageSnapshot = ()=> ({
    type: UNSUBSCRIBE_STORAGE_SNAPSHOT
})


export const setStorageSearchTerm = term=> ({
    type: SET_STORAGE_SEARCHTERM,
    payload: term
})


export const setStoragePage = (page, size)=> ({
    type: SET_STORAGE_PAGE,
    payload: {
        page,
        size
    }
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


export const subscribeTransactionSnapshot = (onSnapshot, onFailed, type)=> ({
    type: SUBSCRIBE_TRX_SNAPSHOT,
    payload:{
        onSnapshot,
        onFailed,
        type
    }
})


export const unsubscribeTransactionSnapshot = type=> ({
    type: UNSUBSCRIBE_TRX_SNAPSHOT,
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


export const setTransactionPage = (page, size, type)=> ({
    type: SET_TRX_PAGE,
    payload: {
        page,
        size,
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
