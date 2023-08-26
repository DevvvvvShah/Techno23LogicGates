
const startTime = new Date().getTime();
  // Update the counter every second
var elapsedTime;
setInterval(() => {
const currentTime = new Date().getTime();
elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
document.getElementById('counter').textContent = `Elapsed time: ${elapsedTime.toFixed(1)} seconds`;
}, 100); // Update every 0.1 second (100 milliseconds)


const number = parent.document.URL.substring(parent.document.URL.indexOf('=')+1, parent.document.URL.length);
var exer;
//console.log(number)
const url = "http://127.0.0.1:5000/api/level/"+number
const response = fetch(url,{
    method: "Get", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include", // include, *same-origin, omit
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json"
      //"Access-Control-Allow-Origin":"http://127.0.0.1:5000"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "manual", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //body: JSON.stringify(data), // body data
}).catch((error) => {
    console.log(error);
}).then((response) => response.json()).then((data) => {
  console.log(response.status);
  const levels = data;
  //console.log(level[1].constructors);
  const level = levels[0];
  const table = level.truthTable;
  const components = level.constructors;
  const input = Object.keys(table[0].input);
  var thead = "<thead>";
  thead+='<tr>';
  for (let i = 0; i < input.length; i++) {
    const element = input[i];
    thead+='<th>'+element.toUpperCase()+'</th>';
  }
  thead+='<th>'+'G'+'</th>';
  thead+='</thead>';
  document.getElementById('tablehead').innerHTML = thead;
  var tbody = "<tbody>";
  for(let k = 0; k<table.length;k++){
    tbody+='<tr>';
    const element = Object.values(table[k].input);
    for (let j = 0; j < input.length; j++) {
      tbody+='<td>'+Number(element[j])+'</td>';
    } 
    tbody+='<th>'+Number(table[k].output)+'</th>'; 
    tbody+='</tr>';
  }
  tbody+='</tbody>';
  document.getElementById('tablebody').innerHTML = tbody;
  var exer = new CircuitExercise({element: $("#design-example"), input: input, output: ["g"],
    grading: table, components: components,addSubmit:false });
  
    $("#submitfinal").click(function(event){
      event.preventDefault();
      exer.grade(function(feedback) {
      new CircuitExerciseFeedback(exer.options, feedback, {element: $("#feedback")});
          if(feedback.success){
            alert("Level completed successfully")
            //send time to db;
            const url = "localhost:5000/api/users/"+localStorage.username;
            const data = {
                'levels':[
                  {
                    'levelno': number,
                    'done':true,
                    'time':elapsedTime.toFixed(1)
                  }
                ]  
            }
            console.log(data);
            const response = fetch(url,{
              method: "Put", // *GET, POST, PUT, DELETE, etc.
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "include", // include, *same-origin, omit
              mode: "cors", // no-cors, *cors, same-origin
              headers: {
                "Content-Type": "application/json"
                //"Access-Control-Allow-Origin":"http://127.0.0.1:5000"
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              redirect: "manual", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify(data), // body data
            }).catch((error) => {
              console.log(error);
            }).then((response) => response.json.then((data) => {
              console.log(response.status);
            }))
              window.location.href = 'Levelpage.html';            
          }
      });
  });
  
  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', function() {
  exer.reset();
  });

  // const submitbutton = document.getElementById('submitfinal');
  // submitbutton.addEventListener('click',function(){
  //     const feed = document.getElementById('feedback');
  //     // feed.style.display = 'flex';
  //     exer.grade(function(feedback) {
  //     new CircuitExerciseFeedback(exer.options, feedback,{element: $("#feedback")});
  //         if(feedback.success){
  //             alert("Level completed successfully")
  //             //send time to db;
  //             const url = "localhost:5000/api/users/"+localStorage.username;
  //             const levelnum = "level"+number;
  //             const data = {
  //               levelnum:{
  //                 'done':true,
  //                 'time':elapsedTime.toFixed(1)
  //               }
  //             }
  //             const response = fetch(url,{
  //               method: "Put", // *GET, POST, PUT, DELETE, etc.
  //               cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //               credentials: "include", // include, *same-origin, omit
  //               mode: "cors", // no-cors, *cors, same-origin
  //               headers: {
  //                 "Content-Type": "application/json"
  //                 //"Access-Control-Allow-Origin":"http://127.0.0.1:5000"
  //                 // 'Content-Type': 'application/x-www-form-urlencoded',
  //               },
  //               redirect: "manual", // manual, *follow, error
  //               referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //               body: JSON.stringify(data), // body data
  //             }).catch((error) => {
  //               console.log(error);
  //             })
  //             window.location.href = 'Levelpage.html'; 
  //         }
  //     });
  // });
  
  })



let componentUsage = {
    and: 0,
    not: 0,
    or: 0,
  };

const maxComponentUsage = {
    and: 2, // Maximum allowed usage for 'and' component
    not: 1, // Maximum allowed usage for 'not' component
    // Add more components and their limits as needed
};


exer.on('componentAdded', function (components) {
    const componentName = components.name;
    console.log(components);
    console.log("andar...");
    if (componentUsage.hasOwnProperty(componentName)) {
        if (componentUsage[componentName] < maxComponentUsage[componentName]) {
        
        componentUsage[componentName]++;
        updateComponentCounter(componentName);
        } else {
        // If usage limit is reached, you can show an alert or take appropriate action
        alert(`Maximum allowed usage for ${componentName} reached.`);
        exer.removeComponent(components);
        }
    }
    });

    function updateComponentCounter(componentName) {
    const counterElement = document.getElementById(`${componentName}Counter`);
    if (counterElement) {
        counterElement.textContent = componentUsage[componentName];
    }
    }