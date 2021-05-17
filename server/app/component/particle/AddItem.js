import React,{Fragment, useState} from "react";

import {InputText} from "primereact/inputtext"
import {InputNumber} from "primereact/inputnumber" 
import {Dialog} from "primereact/dialog"
import {Button} from "primereact/button"



export const AddItem = props=> {
    const [visible, setVisible] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState(0);
    const addAction = e=>{
        e.preventDefault();
        if(props.action)
            props.action(itemName, itemPrice);
        setVisible(false);
        setItemName("");
        setItemPrice(0);
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
                        <span className='input-label'>Price per item</span>
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