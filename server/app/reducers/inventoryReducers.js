
import {combineReducers} from "redux"


import {catalogReducer} from "./inventory/catalog"
import {itemsReducer} from "./inventory/item"
import {logsReducer} from "./inventory/log"
import {trxReducer} from "./inventory/transaction"


const inventoryReducers = combineReducers({
    catalogReducer,
    itemsReducer,
    logsReducer,
    trxReducer
})

export default inventoryReducers;