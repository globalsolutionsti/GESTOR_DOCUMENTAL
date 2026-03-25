const API = "TU_URL_API";

let currentFolder = null;
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) window.location.href = "index.html";

document.getElementById("userName").innerText = user.nombre;

/* ========================= */
function showMsg(text, type="success") {
  const msg = document.getElementById("msg");
  msg.innerText = text;
  msg.className = "msg " + type;

  setTimeout(() => msg.innerText = "", 3000);
}

/* ========================= */
function api(data) {
  return fetch(API, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      token
    })
  }).then(res => res.json());
}

/* ========================= */
function loadRoot() {
  api({ action: "listar" }).then(render);
}

/* ========================= */
function render(data) {

  if (data.status !== "success") return;

  currentFolder = data.folderId;

  const explorer = document.getElementById("explorer");
  explorer.innerHTML = "";

  data.folders.forEach(f => {
    explorer.innerHTML += `
      <div class="item" onclick="openFolder('${f.id}')">
        📁 ${f.nombre}
      </div>
    `;
  });

  data.files.forEach(f => {
    explorer.innerHTML += `
      <div class="item">
        📄 ${f.nombre}
      </div>
    `;
  });
}

/* ========================= */
function openFolder(id) {
  api({ action: "listar", folderId: id }).then(render);
}

/* ========================= */
function crearCarpeta() {

  const nombre = document.getElementById("folderName").value;

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

/* ========================= */
function subirArchivo() {

  const file = document.getElementById("fileInput").files[0];
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
      }
    });
  };

  reader.readAsDataURL(file);
}

/* ========================= */
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/* INIT */
loadRoot();
