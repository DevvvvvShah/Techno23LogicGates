import './App.css';
import Login from './login';
import Instruction from './instruction';
import Levelpage from './levelpage';
import useExternalScripts from './hooks/useScripts';
import React, { useState } from 'react';
// import './scriptimport.js';
// import './hello.js';
// import { Helmet } from 'react-helmet';
import './allcss.css';
// import exer from './scriptimport';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import * as greet from './hello.js'

function App() {
  // useExternalScripts("./libs/jquery-2.1.1.min.js");
  // useExternalScripts("./libs/jquery-ui-1.11.min.js");
  // useExternalScripts("./libs/snap.svg.js");
  // useExternalScripts("./build/lechef.js");
  useExternalScripts("./scriptimport.js");
  return (
    <>
    {/* <scripts src="./scriptimport.js"></scripts>
    <scripts src="./libs/jquery-2.1.1.min.js"></scripts>
    <scripts src="./libs/jquery-ui-1.11.min.js"></scripts>
    <scripts src="./libs/snap.svg.js"></scripts>
    <scripts src="./build/lechef.js"></scripts>
    <scripts src="./scriptimport.js"></scripts> */}
        <Levelpage/>
    

    </>
  );
}

export default App;
