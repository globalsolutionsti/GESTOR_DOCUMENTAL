const API = "https://script.google.com/macros/s/AKfycbwE_FG6FiOQINmfUhTbLI-sPsugUGnCDX22RNHtkBhjS56DFrUTUYu5bsc-gkENw_eu/exec";

let currentFolder = null;

/* 🔐 SESIÓN */
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

/* 🚫 VALIDACIÓN DE ACCESO */
if (!token || !user) {
  window.location.href = "index.html";
}

/* 🚀 INIT SEGURO */
window.onload = () => {

  const userNameEl = document.getElementById("userName");

  if (userNameEl && user) {
    userNameEl.innerText = `${user.nombre} (${user.rol})`;
  }

  loadRoot();
};

/* 💬 MENSAJES PROFESIONALES */
function showMsg(text, type = "success") {
  const msg = document.getElementById("msg");

  if (!msg) return;

  msg.innerText = text;
  msg.className = "msg " + type;

  setTimeout(() => {
    msg.innerText = "";
  }, 3000);
}

/* 🌐 API CENTRALIZADA */
function api(data) {
  return fetch(API, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      token
    })
  })
  .then(res => res.json())
  .catch(() => ({
    status: "error",
    message: "Error de conexión"
  }));
}

/* 📂 CARGAR ROOT */
function loadRoot() {
  api({ action: "listar" }).then(render);
}

/* 🧠 RENDER EXPLORADOR */
function render(data) {

  if (data.status !== "success") {
    showMsg(data.message || "Error al cargar", "error");
    return;
  }

  currentFolder = data.folderId;

  const explorer = document.getElementById("explorer");

  if (!explorer) return;

  explorer.innerHTML = "";

  /* 📁 CARPETAS */
  data.folders.forEach(f => {
    const div = document.createElement("div");
    div.className = "item folder";
    div.innerHTML = `
      <div class="icon">📁</div>
      <div class="name">${f.nombre}</div>
    `;
    div.onclick = () => openFolder(f.id);

    explorer.appendChild(div);
  });

  /* 📄 ARCHIVOS */
  data.files.forEach(f => {
    const div = document.createElement("div");
    div.className = "item file";
    div.innerHTML = `
      <div class="icon">📄</div>
      <div class="name">${f.nombre}</div>
    `;

    explorer.appendChild(div);
  });
}

/* 📂 NAVEGAR */
function openFolder(id) {
  api({ action: "listar", folderId: id }).then(render);
}

/* 📁 CREAR CARPETA */
function crearCarpeta() {

  const input = document.getElementById("folderName");

  if (!input) return;

  const nombre = input.value.trim();

  if (!nombre) {
    showMsg("Escribe un nombre de carpeta", "error");
    return;
  }

  api({
    action: "crearCarpeta",
    folderId: currentFolder,
    nombre
  }).then(res => {

    if (res.status === "success") {
      showMsg("Carpeta creada correctamente");
      input.value = "";
      loadRoot();
    } else {
      showMsg(res.message || "Error al crear carpeta", "error");
    }
  });
}

/* 📤 SUBIR ARCHIVO */
function subirArchivo() {

  const input = document.getElementById("fileInput");

  if (!input || !input.files.length) {
    showMsg("Selecciona un archivo", "error");
    return;
  }

  const file = input.files[0];
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
        showMsg("Archivo subido correctamente");
        input.value = "";
        loadRoot();
      } else {
        showMsg(res.message || "Error al subir archivo", "error");
      }
    });
  };

  reader.readAsDataURL(file);
}

/* 🔓 LOGOUT FUNCIONAL */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  showMsg("Sesión cerrada");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 500);
}
