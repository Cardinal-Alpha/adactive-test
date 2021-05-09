import {createStore} from 'redux';
import authReducers from "./reducers/authReducers";

export const AuthStore = createStore(authReducers);