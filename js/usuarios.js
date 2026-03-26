const API = "https://script.google.com/macros/s/AKfycbz_ghoLIgfYaN-JSlwZ_hJ3KFa06j0TazmEtRULbw5NZnwsS3AqGlQ6_sw8i5a75mo9/exec";

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

function crearUsuario() {

  const usuario = document.getElementById("usuario").value;
  const nombre = document.getElementById("nombre").value;
  const pin = document.getElementById("pin").value;
  const rol = document.getElementById("rol").value;
  const msg = document.getElementById("msg");

  if (!usuario || !nombre || !pin) {
    msg.innerText = "Completa todos los campos";
    return;
  }

  msg.innerText = "Creando...";

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "crearUsuario",
      usuario,
      nombre,
      pin,
      rol,
      token
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.status === "success") {
      msg.innerText = "Usuario creado correctamente";
    } else {
      msg.innerText = data.message;
    }

  })
  .catch(() => {
    msg.innerText = "Error de conexión";
  });
}
