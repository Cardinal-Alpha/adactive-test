import React from "react";
import {connect} from 'react-redux';
import {useHistory} from "react-router-dom";

import {Button} from "primereact/button";

import {doLogout} from "../action/authActions"
import {AuthContext} from '../context'
import {getDefaultApp} from '../firebase/FireApp'


const HomeContent = (props)=>{
    const auth = getDefaultApp().auth();
    const history = useHistory();
    if(!auth.currentUser)
        history.push('/');

    const onSuccess = ()=>{
        history.push('/');
    }

    const onFailed = (err)=>{
        toast.current.show({
            severity: "error",
            summary: "Logout Failed",
            detail: `${err.message}`,
            life: 3000
        });
    }

    return <Button label='Logout' onClick={ e=> props.doLogout(onSuccess, onFailed) }/>
}

export default connect(null, {doLogout}, null, {context: AuthContext})(HomeContent);