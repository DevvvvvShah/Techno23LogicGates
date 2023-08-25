// import { useEffect } from 'react';

// // const useScript = url => {
// //   useEffect(() => {
// //     const script = document.createElement('script');

// //     script.src = url;
// //     script.async = true;

// //     document.body.appendChild(script);

// //     return () => {
// //       document.body.removeChild(script);
// //     }
// //   }, [url]);
// // };

// export default useScript;

var exer = new CircuitExercise({element: $(".circuit-exercise-container"), input: ["y","z","w","x"], output: "g",
    grading: [
        {input: {y: true, z: true,w: true, x: true}, output: true},
        {input: {y: false, z: true,w: true, x: true}, output: false},
        {input: {y: true, z: false,w: true, x: true}, output: false},
        {input: {y: false, z: false,w: true, x: true}, output: false},
        {input: {y: true, z: true,w: false, x: true}, output: true},
        {input: {y: false, z: true,w: false, x: true}, output: false},
        {input: {y: true, z: false,w: false, x: true}, output: true},
        {input: {y: false, z: false,w: false, x: true}, output: true},
        {input: {y: true, z: true,w: true, x: false}, output: true},
        {input: {y: false, z: true,w: true, x: false}, output: true},
        {input: {y: true, z: false,w: true, x: false}, output: false},
        {input: {y: false, z: false,w: true, x: false}, output: true},
        {input: {y: true, z: true,w: false, x: false}, output: true},
        {input: {y: false, z: true,w: false, x: false}, output: true},
        {input: {y: true, z: false,w: false, x: false}, output: true},
        {input: {y: false, z: false,w: false, x: false}, output: true},
    ], components: ["and", "not", "or"]
    
    });

    exer.on('ready', function() {

        const componentUsage = {
          and: 0,
          not: 0,
          or: 0,
        };
      
      
      exer.on('componentAdded', function(component) {
        const componentName = component.name;
        if (componentUsage.hasOwnProperty(componentName)) {
          componentUsage[componentName]++;
          updateComponentCounter(componentName);
        }
      });
      function updateComponentCounter(componentName) {
        const counterElement = document.getElementById(`${componentName}Counter`);
        if (counterElement) {
          counterElement.textContent = componentUsage[componentName];
        }
      }
      });
