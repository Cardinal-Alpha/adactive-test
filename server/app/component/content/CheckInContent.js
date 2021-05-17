import React,{useState, useRef, useEffect} from "react";
import {connect} from "react-redux"

import {DataTable} from "primereact/datatable"
import {Column} from "primereact/column"
import {Toast} from "primereact/toast"

import {
    renderText,
    renderTStamp
} from "../particle/columnBodyRender"

import {
    subscribeTransaction,
    fetchTransaction,
    setTransactionRange 
} from "../../action/inventoryActions"

import {Checking} from "../particle/Checking"

import { AppContext } from "../../context";




const CheckInContent = (props)=>{
    const [list, updateList] = useState([]);
    const [loading, setLoading] = useState(true);
    const notif = useRef(null);
    const logT = "in";

    const onUpdate = itemList=> {
        if(!loading)
            setLoading(true);
        updateList( itemList.map( doc=> doc.data() ) )
        setLoading(false);
    }
    
    const onError = err=> {
        notif.current.show({
            severity: "error",
            summary: "Error Occured",
            detail: err.message
        })
        if(loading)
            setLoading(false);
    }
    
    const onCommittedCheckin = ()=>{
        notif.current.show({
            severity: "success",
            summary: "Check in items success!"
        })
    }

    useEffect(()=>{
        props.subscribe(onUpdate, onError, logT);
        if(loading) props.fetch(logT);
    })

    return <div className='responsive-table'>
                <div className='table-header' style={{marginRight: '15px'}}>
                        <Checking label="Add Item Stock" icon="pi pi-plus" type="in"
                                    onSuccess={onCommittedCheckin} onFailed={onError}/>
                </div>
                <DataTable loading={loading} value={list} paginator rows={10} rowsPerPageOptions={[10,20,50]} >
                    <Column header='Item Name' body={ renderText('Item Name', 'name') }/>
                    <Column header='In Quantity' body={ renderText('In Quantity', 'qty') }/>
                    <Column header='Sum' body={ renderText('Sum', 'sum', '$') }/>
                    <Column header='Note' body={ renderText('Note', 'note') }/>
                    <Column header='Created' body={ renderTStamp('Created', 'timestamp') }/>
                </DataTable>
                <Toast ref={notif}/>
            </div>
}

export default connect(null, {subscribe: subscribeTransaction,
                                fetch: fetchTransaction,
                                setRange: setTransactionRange}, null, {context: AppContext})(CheckInContent);