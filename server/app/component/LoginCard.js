import React, {useRef} from "react";
import {connect} from 'react-redux';
import {useHistory} from "react-router-dom";

import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";

import {setLogin, doLogin} from "../action/authActions";
import {AuthContext} from '../context';
import {getDefaultAuth} from '../firebase/FireApp';


const mapLoginToProps = state=> ({login: state.login});


const LoginCard = (props)=>{
    const toast = useRef(null);
    const login = props.login;
    const history = useHistory();

    getDefaultAuth()
    .then(
        auth =>{
            auth.onIdTokenChanged( user=>{
                if(user)
                    history.push('/dashboard');
            });
        }
    )

    const loginAction = e=>{
        e.preventDefault();
        const onFailed = (err)=>{
            const loginCopy = login;
            props.setLogin(
                loginCopy.email,
                loginCopy.password
            )
            toast.current.show({
                severity: "error",
                summary: "Login Failed",
                detail: `${err.message}`,
                life: 3000
            });
        }
    
        const onSuccess = ()=>{
            history.push('/dashboard');
        }

        props.doLogin(onSuccess, onFailed)
    }

    const registerAction = ()=>{
        history.push('/register');
    }
    
    return <Card className={props.className}>
                <form onSubmit={loginAction}>
                    <div className='p-d-flex p-flex-column p-jc-center p-ai-center'>
                        <span className='p-input-icon-right input-spacing'>
                            <i className='pi pi-envelope'/>
                            <InputText value={login.email}
                                        placeholder='Email'
                                        onChange={ e=> props.setLogin(e.target.value, login.password) }/>
                        </span>
                        <Password value={login.password}
                                    placeholder='Password'
                                    feedback={Boolean(0)}
                                    onChange={e=> props.setLogin(login.email, e.target.value)}
                                    toggleMask
                                    className='input-spacing'/>
                        <Button label='Login' type='submit'/>
                        <div className='register-clue' onClick={registerAction}>
                            Not yet registered? Register here.
                        </div>
                    </div>
                </form>
                <Toast ref={toast} />
        </Card>
}

export default connect(mapLoginToProps, {setLogin, doLogin}, null, {context:AuthContext})(LoginCard);
