import React,{Fragment} from "react";

import {Button} from "primereact/button"



export const renderText = (header, fieldKey, prefix)=>{
    return row=>{
        return (
            <Fragment>
                <div className="m-data-descriptor">{header}</div>
                <div>{prefix? prefix + row[fieldKey] : row[fieldKey]}</div>
            </Fragment>
        )
    }
}



export const renderTStamp = (header, fieldKey)=>{
    return row=>{
        const timeStr = row[fieldKey]? (new Date(row[fieldKey].seconds * 1000))
                                        .toLocaleString('sg', {timezone: "SGT"}) : null;
        return (
            <Fragment>
                <div className="m-data-descriptor">{header}</div>
                <div>{timeStr}</div>
            </Fragment>
        )
    }
}



export const renderDeleteButton = deleteAction=>{
    return row=> (
        <Fragment>
            <div>
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger"
                onClick={deleteAction? deleteAction(row) : null}/>
            </div>
        </Fragment>
    )
}