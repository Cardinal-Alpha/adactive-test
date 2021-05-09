import React from "react";
import {useHistory} from "react-router-dom";

import {Card} from "primereact/card";
import {Button} from "primereact/button";


const HelloCard = (props)=>{
    const history = useHistory();
    const helloAction = ()=>{
        history.push("/");
    }

    return <Card className={props.className}>
                <div className='p-d-flex p-flex-column p-jc-center p-ai-center' style={{width: "300px", height: "200px", textAlign: "justify"}}>
                    <span className='input-spacing'>Registration success! Please login to your new account.</span>
                    <Button label="< Go Back" onClick={helloAction}/>
                </div>
        </Card>
}

export default HelloCard;