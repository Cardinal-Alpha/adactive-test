import React,{Fragment, useState, useEffect} from "react";
import {connect} from "react-redux"

import {Column} from "primereact/column"
import {DataTable} from "primereact/datatable" 
import {Dialog} from "primereact/dialog"
import {Button} from "primereact/button"
import {InputNumber} from "primereact/inputnumber"
import {InputTextarea} from "primereact/inputtextarea"
import {Dropdown} from "primereact/dropdown"

import {
    subscribeStorage,
    fetchStorage,
    addTransactionItem,
    removeTransactionItem,
    updateTransactionItem,
    doItemTransaction
} from "../../action/inventoryActions"

import { AppContext } from "../../context";



const mapStateToProps = state=> ({
    transactions: state.trxReducer.transactions
})


const useForceRefresh = ()=>{
    const refresh = useState(null)[1]
    return ()=>{
        refresh(Math.random());
    }
}


const _Checking = props=> {
    let trxList = [];
    let commitLabel = "";
    switch (props.type) {
        case "in":
            trxList = props.transactions.in.list;
            commitLabel = "Commit Check In";
            break;
    
        case "out":
            trxList = props.transactions.out.list;
            commitLabel = "Commit Check Out";
            break;
    }
    trxList = trxList.map( rec=> ({
        ...rec,
        name: rec.item.data().name,
        sum: rec.item.data().price * rec.qty,
    }) );
    const refresh = useForceRefresh();
    const [itemList, setItemList] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [visible, setVisible] = useState(false);

    const dropdownTemplate = (option, props) => {
        if (option) {
            return (
                <span>{option.value.data().name}</span>
            );
        }
    
        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const doReset = ()=>{
        setSelectedItem(null);
        setVisible(false);
    }

    const addTransaction = e=> {
        e.preventDefault()
        props.addTrx(selectedItem, quantity, "", props.type);
        setItemList( itemList.filter(option=> option.value.id != selectedItem.id) )
        setQuantity(1);
        setSelectedItem(null);
    }

    const commitTransaction = ()=>{
        const onSuccess = ()=>{
            if(props.onSuccess)
                props.onSuccess();
            setVisible(false)
            props.fetchItem();
        }
        props.doTrx(onSuccess, props.onFailed, props.type);
    }

    const renderTrxNote = row=>{
        const updateNote = e=>{
            props.updateTrx(row.item, row.qty, e.target.value, props.type);
            refresh();
        }
        return <InputTextarea rows={3} cols={15} value={row.note}
                onChange={updateNote} autoResize />
    }

    const renderDelTrx = row=>{
        const removeTrx = e=>{
            const newItemList = [...itemList, {
                name: row.item.data().name,
                value: row.item
            }];
            props.removeTrx(row.item, props.type);
            setItemList(newItemList.sort( (a, b)=>{
                if(a.value.data().name < b.value.data().name)
                    return -1
                if(a.value.data().name > b.value.data().name)
                    return 1
                return 0
            }))
        }
        return <Button className='p-button-danger' icon='pi pi-minus' onClick={removeTrx}/>
    }

    useEffect(()=>{
        props.subscribeItem(lst=> setItemList( lst.map( doc=> ({name:doc.data().name, value: doc}) ) ), null);
        if(itemList.length == 0) props.fetchItem();
    }, [visible]);

    return <Fragment>
            <Button label={props.label} icon={props.icon} onClick={()=> setVisible(true)}/>
            <Dialog visible={visible} onHide={ doReset }>
                <div className='dialog-receipt'>
                    <form onSubmit={addTransaction}>
                        <div className='table-header receipt'>
                            <Dropdown value={selectedItem} options={itemList} placeholder="Select an item"
                                        onChange={e=> setSelectedItem(e.value)}
                                        optionLabel='name'
                                        itemTemplate={dropdownTemplate}
                                        required/>
                            <InputNumber value={quantity} min={1}
                                        max={selectedItem && props.type == "out"? selectedItem.data().qty : null}
                                        onChange={ e=> setQuantity(e.value)}
                                        required/>
                            <Button icon="pi pi-plus" type='submit'/>
                        </div>
                    </form>
                    <div className='receipt-log'>
                        {trxList.map( rec=> (
                            <div className='receipt-row p-d-flex p-jc-between'>
                                <div>
                                    <div className='receipt-info p-d-flex p-flex-column'>
                                        <span>{rec.name}</span>
                                        <span>x {rec.qty}</span>
                                    </div>
                                    <div className='receipt-note'>
                                        {renderTrxNote(rec)}
                                    </div>
                                </div>
                                <div className='p-d-flex p-ai-center'>
                                    <span>=</span>
                                </div>
                                <div className='p-d-flex p-ai-center'>
                                    <span>${rec.sum}</span>
                                </div>
                                <div className='p-d-flex p-ai-center'>
                                    {renderDelTrx(rec)}
                                </div>
                            </div>
                        ) )}
                    </div>
                    {trxList.length > 0 ?
                        <div className='p-d-flex p-jc-center' style={{marginTop: "10px"}}>
                            <Button label={commitLabel} onClick={commitTransaction}/>
                        </div> : null}
                </div>
            </Dialog>
        </Fragment>
}


export const Checking = connect(mapStateToProps, {
                                                    subscribeItem: subscribeStorage,
                                                    fetchItem: fetchStorage,
                                                    addTrx: addTransactionItem,
                                                    removeTrx: removeTransactionItem,
                                                    updateTrx: updateTransactionItem,
                                                    doTrx: doItemTransaction
                                                }, null, {context: AppContext})(_Checking);