const API = "https://script.google.com/macros/s/AKfycbz_ghoLIgfYaN-JSlwZ_hJ3KFa06j0TazmEtRULbw5NZnwsS3AqGlQ6_sw8i5a75mo9/exec";

function login() {

  const usuario = document.getElementById("usuario").value;
  const pin = document.getElementById("pin").value;

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      usuario: usuario,
      pin: pin
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.status === "success") {

      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "dashboard.html";

    } else {
      document.getElementById("error").innerText = data.message;
    }

  })
  .catch(err => {
    console.error(err);
  });
}
