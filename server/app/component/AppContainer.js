import React from "react";
import {connect} from 'react-redux';
import {Link, useHistory} from "react-router-dom";

import {Menubar} from 'primereact/menubar'
import {Button} from 'primereact/button'

import {menu} from '../menu'
import {getDefaultAuth} from '../firebase/FireApp'
import {doLogout, setAuthorized} from "../action/authActions"
import {AuthContext} from '../context'


const mapAuthStateToProps = state=>({
    isAuthorized: state.isAuthorized
})


const AppContainer = (props)=>{

    const history = useHistory();

    getDefaultAuth()
    .then(
        auth =>{
            auth.onIdTokenChanged( user=>{
                if(!user){
                    if(history.location.pathname.search(/^\/dashboard/i) == 0)
                        history.push('/');
                    props.setAuthorized(false);
                }
                if(user){
                    if(history.location.pathname.search(/^\/$/i) == 0)
                        history.push('/dashboard');
                    props.setAuthorized(true);
                }
            });
        }
    )

    const onSuccessLogout = ()=>{
        history.push('/');
    }

    const onFailedLogout = (err)=>{
        toast.current.show({
            severity: "error",
            summary: "Logout Failed",
            detail: `${err.message}`,
            life: 3000
        });
    }

    const urlToCommand = level=>{
        level.template = (item, options) => {
            return (
                /* custom element */
                <Link className={options.className} to={item.url}>
                    <span className={options.iconClassName}></span>;
                    <span className={options.labelClassName}>{item.label}</span>;
                </Link>
            );
        }
        if(level.items)
            level.items = level.items.maps(urlToCommand)
        return level;
    }

    menu.model = urlToCommand(menu.model);

        
    const imgLogo = <img src={menu.logo} style={{width: "35px", margin: "0px 10px"}} />;

    const logoutButton = <Button label='Logout' onClick={ e=> props.doLogout(onSuccessLogout, onFailedLogout) }
                                style={{margin: "0px 10px"}}/>;
    
    if(props.isAuthorized){
        return <div className="full-view">
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
    }else{
        return <div>
                <div className="full-view p-d-flex p-ai-center p-jc-center">
                    <div>
                        {props.children}
                    </div>
                </div>
            </div>
    }
}

export default connect(mapAuthStateToProps, {doLogout, setAuthorized}, null, {context: AuthContext})(AppContainer);