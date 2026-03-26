const API = "https://script.google.com/macros/s/AKfycbwE_FG6FiOQINmfUhTbLI-sPsugUGnCDX22RNHtkBhjS56DFrUTUYu5bsc-gkENw_eu/exec";

/* SI YA ESTÁ LOGUEADO → DASHBOARD */
const token = localStorage.getItem("token");

if (token) {
  window.location.href = "dashboard.html";
}

/* LOGIN REAL */
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
      error.innerText = data.message || "Credenciales incorrectas";
    }

  })
  .catch(() => {
    error.innerText = "Error de conexión";
  });
}
