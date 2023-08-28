import React, {useState} from "react";
import {Component} from 'react';

import {useNavigate} from 'react-router-dom';
import './login.css';
export const Login = () => {
    const navigate = useNavigate();
    const [reg_no, setReg_no] = useState('');
    const [password, setPassword] = useState('');

    const handleClick =async (e) => {
        const data = {
            username : reg_no,
            password : password
        }
        console.log(data);
        const response = await fetch("http://127.0.0.1:5000/api/login",{
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "application/json"
              //"Access-Control-Allow-Origin":"http://127.0.0.1:5000"
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "manual", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data
        }).catch((error) => {
            console.log(error);
        })
        console.log(response.status)
        if(response.status===200){
            navigate('/instructions');
        }
    }


    return ( 
        <div className="auth-form-container">
            <video autoPlay loop muted className="background-video">
                <source src="client\src\Pre_comp_1_3.mp4" type="video/mp4" />
             </video>
            <h1 >Login</h1>
            <form className="login-form" >
                <label htmlFor="Reg_no">Registration number</label>
                <input value = {reg_no} onChange= {(e)=> setReg_no(e.target.value)}type="reg_no" placeholder="Enter the registration number" id = "reg_no" name = "reg_no" />
                <label htmlFor="password">Password</label>
                <input value = {password} onChange= {(e)=> setPassword(e.target.value)} type="password" placeholder="*********" id = "password" name = "password" />
                <button type="button" onClick={handleClick}>Login</button>
            </form>
        </div>
     );
}
 
export default Login;