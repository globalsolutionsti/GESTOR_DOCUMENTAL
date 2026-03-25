const API = "https://script.google.com/macros/s/AKfycbz_ghoLIgfYaN-JSlwZ_hJ3KFa06j0TazmEtRULbw5NZnwsS3AqGlQ6_sw8i5a75mo9/exec";

function login() {

  const usuario = document.getElementById("usuario").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const error = document.getElementById("error");

  if (!usuario || !pin) {
    error.innerText = "Ingresa usuario y PIN";
    return;
  }

  error.innerText = "Validando...";

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      usuario,
      pin
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.status === "success") {

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "dashboard.html";

    } else {
      error.innerText = data.message || "Error en login";
    }

  })
  .catch(() => {
    error.innerText = "Error de conexión";
  });
}
