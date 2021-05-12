
//Auth Actions
export const SET_LOGIN = "SET_LOGIN";;
export const DO_LOGIN = "DO_LOGIN";
export const SET_REGISTRATION = "SET_REGISTRATION";
export const DO_REGISTRATION = "DO_REGISTRATION";
export const DO_LOGOUT = "DO_LOGOUT";
export const SET_AUTHORIZED = "SET_AUTHORIZED";


//Inventory Actions --->
//--> Storage item catalog
export const ADD_STORAGE_ITEM = "ADD_STORAGE_ITEM";
export const REMOVE_STORAGE_ITEM = "REMOVE_STORAGE_ITEM";
//--> Storage status
export const SUBSCRIBE_STORAGE_SNAPSHOT = "SUBSCRIBE_STORAGE_SNAPSHOT";
export const UNSUBSCRIBE_STORAGE_SNAPSHOT = "UNSUBSCRIBE_STORAGE_SNAPSHOT";
export const SET_STORAGE_SEARCHTERM = "SET_STORAGE_SEARCHTERM";
export const SET_STORAGE_PAGE = "SET_STORAGE_PAGE";
//--> Item transaction
export const ADD_TRX_ITEMS = "ADD_TRX_ITEMS";
export const REMOVE_TRX_ITEMS = "REMOVE_TRX_ITEMS";
export const DO_ITEMS_TRX = "DO_ITEMS_TRX";
//-- Transaction log
export const SUBSCRIBE_TRX_SNAPSHOT = "SUBSCRIBE_TRX_SNAPSHOT";
export const UNSUBSCRIBE_TRX_SNAPSHOT = "UNSUBSCRIBE_TRX_SNAPSHOT";
export const SET_TRX_RANGE = "SET_TRX_RANGE";
export const SET_TRX_PAGE = "SET_TRX_PAGE";
