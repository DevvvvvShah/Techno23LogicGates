import React, {useState} from "react";

export const Login = () => {
    const [reg_no, setReg_no] = useState('');
    const [password, setPassword] = useState('');

    const handlesubmit = (e) => {
        e.prevent_default();
        console.log(reg_no);
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