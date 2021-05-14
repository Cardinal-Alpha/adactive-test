import React,{Fragment, useState, useRef, useEffect} from "react";
import {connect} from "react-redux"

import {InputText} from "primereact/inputtext"
import {InputNumber} from "primereact/inputnumber" 
import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {Toast} from "primereact/toast"
import {Dialog} from "primereact/dialog"
import {confirmDialog} from "primereact/confirmdialog"
import {Button} from "primereact/button"

import {
    subscribeStorage,
    fetchStorage,
    setStorageSearchTerm,
    addItemToCatalog,
    removeItemFromCatalog
} from "../../action/inventoryActions";
import {AppContext} from "../../context"



const AddItem = props=> {
    const [visible, setVisible] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const addAction = e=>{
        e.preventDefault();
        if(props.action)
            props.action(itemName, itemPrice);
        setVisible(false);
    }
    return <Fragment>
            <Button label={props.label} icon={props.icon} onClick={()=> setVisible(true)}/>
            <Dialog visible={visible} onHide={ ()=>setVisible(false) }>
                <form onSubmit={addAction} >
                    <div className='input-spacing'>
                        <span className='input-label'>Item name</span>
                        <InputText value={itemName}
                                    onChange={ e=>setItemName(e.target.value) }
                                    required
                                    style={{width: "243px"}}/>
                    </div>
                    <div className='input-spacing'>
                        <span className='input-label'>Price</span>
                        <InputNumber value={itemPrice}
                                    onChange={ e=>setItemPrice(e.value) }
                                    mode="currency"
                                    currency="SGD"
                                    locale="en-SG"
                                    required/>
                    </div>
                    <div className="p-d-flex p-jc-center">
                        <Button label='Submit Item' type="submit"/>
                    </div>
                </form>
            </Dialog>
        </Fragment>
}



const renderText = (header, fieldKey, prefix)=>{
    return row=>{
        return (
            <React.Fragment>
                <div className="m-data-descriptor">{header}</div>
                <div>{prefix? prefix + row[fieldKey] : row[fieldKey]}</div>
            </React.Fragment>
        )
    }
}



const renderTStamp = (header, fieldKey)=>{
    return row=>{
        const timeStr = row[fieldKey]? (new Date(row[fieldKey].seconds * 1000))
                                        .toLocaleString('sg', {timezone: "SGT"}) : null;
        return (
            <React.Fragment>
                <div className="m-data-descriptor">{header}</div>
                <div>{timeStr}</div>
            </React.Fragment>
        )
    }
}



const renderDeleteButton = deleteAction=>{
    return row=> (
        <React.Fragment>
            <div>
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger"
                onClick={deleteAction? deleteAction(row) : null}/>
            </div>
        </React.Fragment>
    )
}



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
            <div className='table-header' style={{marginRight: '15px'}}>
                <div className='p-input-icon-left'>
                    <i className='pi pi-search'/>
                    <InputText placeholder='Search' 
                            value={search}
                            onChange={ e=> searchAction(e.target)}/>
                </div>
                <div style={{marginLeft: "10px"}}>
                    <AddItem label="Add Catalog" icon="pi pi-plus" action={makeAddAction()}/>
                </div>
            </div>
            <DataTable loading={loading} value={list} paginator rows={10} rowsPerPageOptions={[10,20,50]} >
                <Column header='Item Name' body={ renderText('Item Name', 'name') }/>
                <Column header='Stock' body={ renderText('Stock', 'qty') }/>
                <Column header='Price' body={ renderText('Price', 'price', '$') }/>
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