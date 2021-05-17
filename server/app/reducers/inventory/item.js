import {
//--> Storage status
    SUBSCRIBE_STORAGE,
    FETCH_STORAGE,
    SET_STORAGE_SEARCHTERM,
} from "../../actionTypes"

import {getDefaultFirestore} from "../../firebase/FireApp" 


const initItemsData = {
    items:{
        searchTerm: "",
        onFetch: null,
        onFailed: null
    }
}


const execQuery = items => {
    const db = getDefaultFirestore();
    const searchTerm = items.searchTerm;
    const onFetch = items.onFetch;
    const onFailed = items.onFailed;
    if(onFetch)
        db.collection('storage')
        .get()
        .then(
        snapshot=>{
            const list = searchTerm ? 
                            snapshot.docs.filter( doc=> doc.data().name.search(searchTerm) >=0)
                            : snapshot.docs;
            if(onFetch)
                onFetch(list);
        })
        .catch(err=>{
            if(onFailed)
                onFailed(err);
        });
    return {...items};
}


const getItemsFromState = state=> ({...state.items})

const setItemsToState = (state, items)=>{
    state.items = items;
    return state
}


export const itemsReducer = (state = initItemsData, action)=>{
    const item = getItemsFromState(state)
    switch (action.type) {
        case SET_STORAGE_SEARCHTERM:
            item.searchTerm = action.payload;
            return setItemsToState(state, execQuery(item));

        case SUBSCRIBE_STORAGE:
            item.onFetch = action.payload.onFetch;
            item.onFailed = action.payload.onFailed;
            return setItemsToState(state, item);

        case FETCH_STORAGE:
            return setItemsToState(state, execQuery(item));

        default:
            return state;
    }
}