import React, {useRef} from "react";
import {connect} from 'react-redux';
import {useHistory} from "react-router-dom";

import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast"

import {setRegistration, doRegistration} from "../action/authActions"
import {AuthContext} from '../context'

const mapRegistrationToProps = state=> ({registration: state.registration});


const RegisterCard = (props)=>{
    const toast = useRef(null);
    const registration = props.registration;
    const history = useHistory();

    const setDisplayName = displayName=>{
        props.setRegistration(
            displayName,
            registration.email,
            registration.password
        )
    };
    const setEmail = email=>{
        props.setRegistration(
            registration.displayName,
            email,
            registration.password
        )
    };
    const setPassword = password=>{
        props.setRegistration(
            registration.displayName,
            registration.email,
            password
        )
    };

    const registerAction = ()=>{
        const onFailed = (err)=>{
            const regCopy = registration;
            toast.current.show({
                severity: "error",
                summary: "Registration Failed",
                detail: `${err.message}`,
                life: 3000
            });
            props.setRegistration(
                registration.displayName,
                registration.email,
                registration.password
            )
        }
    
        const onSuccess = ()=>{
            history.push('/register/hello');
            props.setRegistration('', '', '');
        }

        props.doRegistration(onSuccess, onFailed)
    }

    const mandatoryMark = <span style={{color:'red'}}>*</span>;

    return <Card className={props.className}>
                <div className='p-d-flex p-flex-column p-jc-center p-ai-bottom'>
                    <div className='input-spacing'>
                        <span className='input-label'>Username</span>
                        <InputText value={registration.displayName}
                                    onChange={ e=>setDisplayName(e.target.value) }
                                    style={{width: "243px"}}/>
                    </div>
                    <div className='input-spacing'>
                        <span className='input-label'>Email {mandatoryMark}</span>
                        <InputText value={registration.email}
                                    onChange={ e=>setEmail(e.target.value) }
                                    required
                                    style={{width: "243px"}}/>
                    </div>
                    <div className='input-spacing'>
                        <span className='input-label'>Password {mandatoryMark}</span>
                        <Password value={registration.password}
                                    onChange={e=>{ setPassword(e.target.value) }}
                                    toggleMask
                                    className='input-spacing'
                                    required/>
                    </div>
                    <Button label='Register' onClick={registerAction}/>
                </div>
            <Toast ref={toast} />
        </Card>
}

export default connect(mapRegistrationToProps, {setRegistration, doRegistration}, null, {context: AuthContext})(RegisterCard);