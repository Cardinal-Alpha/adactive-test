import {
//--> Storage status
    SUBSCRIBE_STORAGE_SNAPSHOT,
    UNSUBSCRIBE_STORAGE_SNAPSHOT,
    SET_STORAGE_SEARCHTERM,
    SET_STORAGE_PAGE,
} from "../../actionTypes"

import {getDefaultFirestore} from "../../firebase/FireApp" 


const initItemsData = {
    items:{
        page: 1,
        size: 20,
        searchTerm: "",
        onSnapshot: null,
        onFailed: null,
        unsubscriber: null
    }
}


const setQueryToItem = items => {
    const db = getDefaultFirestore();
    const page = items.page;
    const size = items.size;
    const searchTerm = items.searchTerm;
    const onSnap = items.onSnapshot;
    const onFailed = items.onFailed;
    if(items.unsubscriber)
        items.unsubscriber();
    if(page && size && onSnap)
        items.unsubscriber = db.collection('storage')
                                .onSnapshot(
                                snapshot=>{
                                    const list = searchTerm ? 
                                                    snapshot.docs.filter( doc=> doc.data().name.search(searchTerm) >=0)
                                                    : snapshot.docs;
                                    const offset = (page-1)*size;
                                    if(onSnap)
                                        onSnap( list.slice( offset, offset + size) );
                                },
                                err=>{
                                    if(onFailed)
                                        onFailed(err);
                                });
    return items;
}


const getItemsFromState = state=> ({...state.items})

const setItemsToState = (state, items)=>{
    state.items = items;
    return state
}


export const itemsReducer = (state = initItemsData, action)=>{

    switch (action.type) {
        case SET_STORAGE_SEARCHTERM:
            const item = getItemsFromState(state)
            item.searchTerm = action.payload;
            return setItemsToState(state, setQueryToItem(item));

        case SET_STORAGE_PAGE:
            const item = getItemsFromState(state)
            item.page = action.payload.page;
            item.size = action.payload.size;
            return setItemsToState(state, setQueryToItem(item));

        case SUBSCRIBE_STORAGE_SNAPSHOT:
            const item = getItemsFromState(state)
            item.onSnapshot = action.payload.onSnapshot;
            item.onFailed = action.payload.onFailed;
            return setItemsToState(state, setQueryToItem(item));

        case UNSUBSCRIBE_STORAGE_SNAPSHOT: 
            const item = getItemsFromState(state)
            const unsub = item.unsubscriber;
            if(unsub)
                unsub();
            item.onSnapshot = null;
            item.onFailed = null;
            item.unsubscriber = null;
            return setItemsToState(state, item);

        default:
            return state;
    }
}