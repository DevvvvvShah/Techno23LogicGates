import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
export const Login = () => {
    const navigate = useNavigate();
    const [reg_no, setReg_no] = useState('');
    const [password, setPassword] = useState('');

    const handlesubmit =async (e) => {
        const data = {
            username : reg_no,
            password : password
        }
        const response = await fetch("localhost:5000/api/login",{
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data
        })
        if(response.status===200){
            navigate('/instructions');
        }
    }


    return ( 
        <div className="auth-form-container">
            <h2 >login</h2>
            <form className="login-form" onSubmit={handlesubmit} >
                <label htmlFor="reg_no">reg_no</label>
                <input value = {reg_no} onChange= {(e)=> setReg_no(e.target.value)}type="reg_no" placeholder="mail..." id = "reg_no" name = "reg_no" />
                <label htmlFor="password">password</label>
                <input value = {password} onChange= {(e)=> setPassword(e.target.value)} type="password" placeholder="***" id = "password" name = "password" />
                <button type="submit">Login</button>
            </form>
        </div>
     );
}
 
export default Login;