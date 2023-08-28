import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Helmet} from "react-helmet";
import useScript from './hooks/useScripts';
// import './allcss.css';
import "./scriptimport";
const Levelpage = () => {
    // const refreshButton = document.getElementById('refreshButton');
    // refreshButton.addEventListener('click', function() {
    //     location.reload();
    // });
    return( 
    <div>
        {/* <Helmet> */}
            {/* <scripts src="./scriptimport.js"></scripts>
            <scripts src="../public/libs/jquery-2.1.1.min.js"></scripts>
            <scripts src="../public/libs/jquery-ui-1.11.min.js"></scripts>
            <scripts src="../public/libs/snap.svg.js"></scripts>
            <scripts src="../public/build/lechef.js"></scripts> */}
        {/* </Helmet> */}
        {/* <scripts src="./scriptimport.js"></scripts> */}
        <h1>Circuit Exercise Example</h1>
        <div>Construct a circuit for this truth table:</div>
            <table>
                <thead>
                    <tr><th>Y</th><th>Z</th><th>W</th><th>X</th><th>G</th></tr>
                </thead>
                <tbody>
                    <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
                    <tr><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
                    <tr><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
                    <tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
                    <tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
                    <tr><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
                    <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
                    <tr><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
                    <tr><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
                    <tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
                    <tr><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
                    <tr><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
                    <tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
                    <tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
                    <tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
                    <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
                </tbody>
            </table>


            <button id="refreshButton">Refresh</button>
            <div className='circuit-exercise-container'></div>
            {/* <Levelpag/> */}
            <div id="componentUsage">
                <h3>Component Usage:</h3>
                <ul>
                    <li>AND: <span id="andCounter">0</span></li>
                    <li>NOT: <span id="notCounter">0</span></li>
                    <li>OR: <span id="orCounter">0</span></li>
                </ul>
        </div>
    </div>);
}
 
export default Levelpage;