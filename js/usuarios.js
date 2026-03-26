const API = "https://script.google.com/macros/s/AKfycbwE_FG6FiOQINmfUhTbLI-sPsugUGnCDX22RNHtkBhjS56DFrUTUYu5bsc-gkENw_eu/exec";

const token = localStorage.getItem("token");

// 🔒 Validar sesión
if (!token) {
  window.location.href = "index.html";
}

/* =========================
   CREAR USUARIO
========================= */
function crearUsuario() {

  const usuario = document.getElementById("usuario").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
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

      // Mostrar PIN
      pinGenerado.innerText = data.pin;
      pinBox.style.display = "block";

      // Limpiar campos
      document.getElementById("usuario").value = "";
      document.getElementById("nombre").value = "";

      // Recargar tabla
      cargarUsuarios();

    } else {
      msg.innerText = data.message;
    }

  })
  .catch(() => {
    msg.innerText = "Error de conexión";
  });
}

/* =========================
   LISTAR USUARIOS
========================= */
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

/* =========================
   EVENTO BOTÓN
========================= */
document.getElementById("btnCrear")
  .addEventListener("click", crearUsuario);

/* =========================
   INICIAR
========================= */
cargarUsuarios();
