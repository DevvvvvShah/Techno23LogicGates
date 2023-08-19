import logo from './logo.svg';
import './App.css';
import Login from './login';
import React, { useState } from 'react';
import InteractiveNandBuilder from './general_level';

function App() {
  return (
    <div className="App">
      <InteractiveNandBuilder></InteractiveNandBuilder> 
    </div>
  );
}

export default App;
