import React,{useState, useRef, useEffect} from "react";
import {connect} from "react-redux"

import {InputText} from "primereact/inputtext"
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {Toast} from "primereact/toast"
import {confirmDialog} from "primereact/confirmdialog"

import {
    subscribeStorage,
    fetchStorage,
    setStorageSearchTerm,
    addItemToCatalog,
    removeItemFromCatalog
} from "../../action/inventoryActions";

import {AppContext} from "../../context"

import {
    renderDeleteButton,
    renderText,
    renderTStamp
} from "../particle/columnBodyRender"

import {AddItem} from "../particle/AddItem"



const StorageContent = (props)=>{
    const [list, updateList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setInputSearch] = useState("");
    const notif = useRef(null);

    const onUpdate = itemList=> {
        if(!loading)
            setLoading(true);
        updateList( itemList.map( doc=> doc.data() ) )
        setLoading(false);
    }
    
    const onError = err=> {
        notif.current.show({
            severity: "error",
            summary: "Error occured",
            detail: err.message
        })
        if(loading)
            setLoading(false);
    }

    const searchAction = target=>{
        if(!loading)
            setLoading(true);
        const searchCopy = target.value;
        setTimeout(()=>{
            if(target.value == searchCopy)
                props.setSearch(searchCopy);
        }, 500)
        setInputSearch(target.value);
    }

    const deleteAction = row=>{
        const onSuccess = ()=>{
            notif.current.show({
                severity: "success",
                summary: "Item removed successfully"
            })
            props.fetch();
        }
        return ()=>{
            if(row.qty == 0){
                confirmDialog({
                    message: `Are you sure want to delete ${row.name}?`,
                    header: "Item Removal",
                    icon: 'pi pi-exclamation-triangle',
                    accept: ()=> {
                        setLoading(true);
                        props.removeItem(row.name, onSuccess, onError);
                    }
                })
            }else{
                notif.current.show({
                    severity: "warn",
                    summary: "Warning",
                    detail: "Removal of non empty stock is forbidden"
                })
            }
        }
    }

    const makeAddAction = ()=>{
        const onSuccess = ()=>{
            notif.current.show({
                severity: "success",
                summary: "Item added successfully"
            })
            props.fetch();
        }
        return (name, price)=>{
            setLoading(true);
            props.addItem(name, price, onSuccess, onError);
        }
    }

    useEffect(()=>{
        props.subscribe(onUpdate, onError);
        if(loading) props.fetch();
    })

    return (
        <div className='responsive-table'>
            <div className='table-header'>
                <div className='p-input-icon-left'>
                    <i className='pi pi-search'/>
                    <InputText placeholder='Search' 
                            value={search}
                            onChange={ e=> searchAction(e.target)}/>
                </div>
                <div>
                    <AddItem label="Add Catalog" icon="pi pi-plus" action={makeAddAction()}/>
                </div>
            </div>
            <DataTable loading={loading} value={list} paginator rows={10} rowsPerPageOptions={[10,20,50]} >
                <Column header='Item Name' body={ renderText('Item Name', 'name') }/>
                <Column header='Stock' body={ renderText('Stock', 'qty') }/>
                <Column header='Price per item' body={ renderText('Price per item', 'price', '$') }/>
                <Column header='Last Update' body={ renderTStamp('Last Update', 'last_update') }/>
                <Column body={ renderDeleteButton(deleteAction) }/>
            </DataTable>
            <Toast ref={notif}/>
        </div>
    )
}



export default connect(null, {
                            subscribe: subscribeStorage,
                            fetch: fetchStorage,
                            setSearch: setStorageSearchTerm,
                            addItem: addItemToCatalog,
                            removeItem: removeItemFromCatalog}, null, {context: AppContext})(StorageContent);