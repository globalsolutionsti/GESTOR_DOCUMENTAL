const API = "https://script.google.com/macros/s/AKfycbz_ghoLIgfYaN-JSlwZ_hJ3KFa06j0TazmEtRULbw5NZnwsS3AqGlQ6_sw8i5a75mo9/exec";

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

function crearUsuario() {

  const usuario = document.getElementById("usuario").value;
  const nombre = document.getElementById("nombre").value;
  const rol = document.getElementById("rol").value;

  const msg = document.getElementById("msg");
  const pinBox = document.getElementById("pinBox");
  const pinGenerado = document.getElementById("pinGenerado");

  if (!usuario || !nombre) {
    msg.innerText = "Completa todos los campos";
    return;
  }

  msg.innerText = "Creando...";
  pinBox.style.display = "none";

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "crearUsuario",
      usuario,
      nombre,
      rol,
      token
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.status === "success") {

  msg.innerText = "Usuario creado correctamente";

  pinGenerado.innerText = data.pin;
  pinBox.style.display = "block";

  cargarUsuarios(); // 👈 AGREGA ESTA LÍNEA

} else {
      msg.innerText = data.message;
    }

  })
  .catch(() => {
    msg.innerText = "Error de conexión";
  });
}
function cargarUsuarios() {

  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      action: "listarUsuarios",
      token
    })
  })
  .then(res => res.json())
  .then(data => {

    const tbody = document.querySelector("#tablaUsuarios tbody");
    tbody.innerHTML = "";

    data.usuarios.forEach(u => {

      tbody.innerHTML += `
        <tr>
          <td>${u.usuario}</td>
          <td>${u.nombre}</td>
          <td>${u.rol}</td>
          <td>${u.activo ? "Activo" : "Inactivo"}</td>
        </tr>
      `;
    });

  });
}
