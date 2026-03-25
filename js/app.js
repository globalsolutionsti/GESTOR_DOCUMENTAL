const API = "https://script.google.com/macros/s/AKfycbz_ghoLIgfYaN-JSlwZ_hJ3KFa06j0TazmEtRULbw5NZnwsS3AqGlQ6_sw8i5a75mo9/exec";
let currentFolder = null;

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  window.location.href = "index.html";
}

document.getElementById("userName").innerText =
  user.nombre + " (" + user.rol + ")";

/* MENSAJES */
function showMsg(text, type="success") {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  msg.className = "msg " + type;

  setTimeout(() => msg.innerText = "", 3000);
}

/* API */
function api(data) {
  return fetch(API, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      token
    })
  }).then(res => res.json());
}

/* LOAD */
function loadRoot() {
  api({ action: "listar" }).then(render);
}

/* RENDER */
function render(data) {

  if (data.status !== "success") {
    showMsg("Error al cargar", "error");
    return;
  }

  currentFolder = data.folderId;

  const explorer = document.getElementById("explorer");
  explorer.innerHTML = "";

  data.folders.forEach(f => {
    explorer.innerHTML += `
      <div class="item" onclick="openFolder('${f.id}')">
        📁<br>${f.nombre}
      </div>
    `;
  });

  data.files.forEach(f => {
    explorer.innerHTML += `
      <div class="item">
        📄<br>${f.nombre}
      </div>
    `;
  });
}

/* NAV */
function openFolder(id) {
  api({ action: "listar", folderId: id }).then(render);
}

/* CREAR */
function crearCarpeta() {

  const nombre = document.getElementById("folderName").value;

  if (!nombre) return showMsg("Escribe un nombre", "error");

  api({
    action: "crearCarpeta",
    folderId: currentFolder,
    nombre
  }).then(res => {

    if (res.status === "success") {
      showMsg("Carpeta creada");
      loadRoot();
    } else {
      showMsg(res.message, "error");
    }
  });
}

/* SUBIR */
function subirArchivo() {

  const file = document.getElementById("fileInput").files[0];

  if (!file) return showMsg("Selecciona un archivo", "error");

  const reader = new FileReader();

  reader.onload = function(e) {

    const base64 = e.target.result.split(",")[1];

    api({
      action: "subirArchivo",
      folderId: currentFolder,
      nombre: file.name,
      mime: file.type,
      file: base64
    }).then(res => {

      if (res.status === "success") {
        showMsg("Archivo subido");
        loadRoot();
      } else {
        showMsg("Error al subir", "error");
      }
    });
  };

  reader.readAsDataURL(file);
}

/* LOGOUT FIX */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

/* INIT */
loadRoot();
