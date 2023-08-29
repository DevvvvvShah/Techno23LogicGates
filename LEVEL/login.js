    const loginForm = document.getElementById('submit');
    loginForm.addEventListener('click', async function(event) {
      event.preventDefault(); // Prevent the form from submitting normally
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      console.log({'username':username,'password':password});
      const response = await fetch("http://127.0.0.1:5000/api/login",{
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            mode: "cors", // no-cors, *cors, same-origin
            headers: {
              "Content-Type": "application/json",
            //   "Access-Control-Allow-Origin":'*'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "manual", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({'username':username,'password':password}), // body data
        }).catch((error) => {
            console.log(error);
        })
        console.log(response);
      if(response.status===200){
        alert('Login successful!');
        localStorage.username = username;
        localStorage.password = password;
        window.location.href = '/levelpage';
      } else {
        alert('Login failed. Please check your credentials.');
      }
    });