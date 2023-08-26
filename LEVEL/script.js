
const startTime = new Date().getTime();

  // Update the counter every second
setInterval(() => {
const currentTime = new Date().getTime();
const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
document.getElementById('counter').textContent = `Elapsed time: ${elapsedTime.toFixed(1)} seconds`;
}, 100); // Update every 0.1 second (100 milliseconds)

$(function(){
    var exer = new CircuitExercise({element: $("#design-example"), input: ["x", "y"], output: "g",
    grading: [{input: {x: true, y: false}, output: false},
        {input: {x: false, y: true}, output: false},
        {input: {x: true, y: true}, output: true},
        {input: {x: false, y: false}, output: false}], components: ["and", "not", "or", "eqv"], addSubmit: false});
    var styleButtons = function() {
    // add bootstrap classes to style the buttons
    exer.element.find("button").addClass("btn btn-success btn-sm");
    };
    styleButtons();
    $(".design-example .reset").click(function(event){
    event.preventDefault();
    exer.reset();
    // reapply the Bootstrap button styles
    styleButtons();
    });
    $(".design-example .feedback").click(function(event){
        event.preventDefault();
        exer.grade(function(feedback) {
        new CircuitExerciseFeedback(exer.options, feedback, {element: $("#design-example-feedback")});
            if(feedback.success){
                alert("Level completed successfully")
                window.location.href = 'Levelpage.html'; 
                //send time to db;               
            }
        });
    });
});

