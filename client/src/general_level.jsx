import React, { useState } from 'react';
import AndGate from './And_gate';
import NotGate from './Not_gate';
const InteractiveGateBuilder = () => {
  const [andGates, setAndGates] = useState([]);
  const [notGates, setNotGates] = useState([]);

  const addAndGate = (x, y) => {
    setAndGates([...andGates, { x, y }]);
  };

  const addNotGate = (x, y) => {
    setNotGates([...notGates, { x, y }]);
  };

  
  return (
    <div>
      <h2>NAND Gate</h2>
      <div>
        {andGates.map((andGate, index) => (
          <AndGate key={index} x={andGate.x} y={andGate.y} />
        ))}
        {notGates.map((notGate, index) => (
          <NotGate key={index} x={notGate.x} y={notGate.y} />
        ))}
      </div>
      <button onClick={() => addAndGate(50, 50)}>Add AND Gate</button>
      <button onClick={() => addNotGate(150, 50)}>Add NOT Gate</button>
    </div>
  );
};

export default InteractiveGateBuilder;