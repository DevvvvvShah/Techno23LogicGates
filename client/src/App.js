import './App.css';
import Login from './login';
import Instruction from './instruction';
import levelpage from './levelpage';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <Routes>
    //       <Route path = "/" element={<Login/>} />
    //       <Route path = "/instructions" element={<Instruction/>} />
    //       <Route path = "/Inter" element={<InteractiveNandBuilder/>} />
    <levelpage/>
    //     </Routes>
    //   </div>
    // </Router>


  );
}

export default App;
