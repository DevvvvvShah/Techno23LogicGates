import React, { useState } from 'react';

const NotGate = () => {
  const [inputA, setInputA] = useState(false);
  const result = !inputA ;

  return (
    <div>
      <h2>Not Gate</h2>
      <label>
        Input A:
        <input
          
          type="checkbox"
          checked={inputA}
          onChange={(e) => setInputA(e.target.checked)}
        />
      </label>
      <p>Result: {result.toString()}</p>
    </div>
  );
};

export default NotGate;