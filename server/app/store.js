import {createStore} from 'redux';
import authReducers from "./reducers/authReducers";
import inventoryReducers from "./reducers/inventoryReducers"

export const AuthStore = createStore(authReducers);

export const AppStore = createStore(inventoryReducers);