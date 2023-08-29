const url0 = "http://127.0.0.1:5000/api/users/" + localStorage.username;
const response0 = fetch(url0, {
  method: "Get", // *GET, POST, PUT, DELETE, etc.
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "include", // include, *same-origin, omit
  mode: "cors", // no-cors, *cors, same-origin
  headers: {
    "Content-Type": "application/json",
    //"Access-Control-Allow-Origin":"http://127.0.0.1:5000"
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  redirect: "manual", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //body: JSON.stringify(data), // body data
})
  .catch((error) => {
    console.log(error);
  })
  .then((response) => response.json())
  .then((data) => {
    levels = data.levels;
    for (let index = 0; index < levels.length; index++) {
      const level = levels[index];
      if (level.done === true) {
        console.log(level.levelno);
        const button = document.getElementById(`level${level.levelno}`);
        button.classList.add("done");
        button.disabled = true;
      }
    }
  });

var levelnum;
function showModal(level) {
  const modal = document.getElementById("myPop");
  modal.style.display = "flex";
  levelnum = level;
}

function closeModal(confirm) {
  const modal = document.getElementById("myPop");
  modal.style.display = "none";
  if (confirm) {
    window.location.href = "/level/" + levelnum;
  }
}
