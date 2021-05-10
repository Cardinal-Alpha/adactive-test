import React from "react";
import {connect} from 'react-redux';
import {useHistory} from "react-router-dom";

import {Menubar} from 'primereact/menubar'
import {Button} from 'primereact/button'

import {menu} from '../menu'
import {getDefaultAuth} from '../firebase/FireApp'
import {doLogout} from "../action/authActions"
import {AuthContext} from '../context'

const DashboardContainer = (props)=>{

    const history = useHistory();

    getDefaultAuth()
    .then(
        auth =>{
            auth.onIdTokenChanged( user=>{
                if(!user)
                    history.push('/');
            });
        }
    )

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

    const urlToCommand = level=>{
        const url = level.url;
        delete level.url;
        level.command = e=>{
            history.push(url);
        }
        if(level.items)
            level.items = level.items.maps(urlToCommand)
        return level;
    }

    menu.model = urlToCommand(menu.model);

        
    const imgLogo = <img src={menu.logo} style={{width: "35px", margin: "0px 10px"}} />;

    const logoutButton = <Button label='Logout' onClick={ e=> props.doLogout(onSuccess, onFailed) }
                                style={{margin: "0px 10px"}}/>;
    
    return <div>
                <div className="full-view">
                    <Menubar style={{width: "100%"}} 
                                model={menu.model} 
                                start={imgLogo} 
                                end={logoutButton} />
                    <div style={{padding: "2vw", height: "100%"}}>
                        <div style={{height: "100%", width: "100%"}} >
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
}

export default connect(null, {doLogout}, null, {context: AuthContext})(DashboardContainer);