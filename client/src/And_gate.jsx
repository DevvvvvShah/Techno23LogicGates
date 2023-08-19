import React, { useState } from 'react';

const AndGate = () => {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const result = inputA && inputB;

  return (
    <div>
      <h2>AND Gate</h2>
      <label>
        Input A:
        <input
          type="checkbox"
          checked={inputA}
          onChange={(e) => setInputA(e.target.checked)}
        />
      </label>
      <label>
        Input B:
        <input
          type="checkbox"
          checked={inputB}
          onChange={(e) => setInputB(e.target.checked)}
        />
      </label>
      <p>Result: {result.toString()}</p>
    </div>
  );
};

export default AndGate;

