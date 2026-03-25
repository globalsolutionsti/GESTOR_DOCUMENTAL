const API = "https://script.google.com/macros/s/AKfycbz_ghoLIgfYaN-JSlwZ_hJ3KFa06j0TazmEtRULbw5NZnwsS3AqGlQ6_sw8i5a75mo9/exec";

/* 🔐 SI YA HAY SESIÓN → DASHBOARD */
const token = localStorage.getItem("token");

if (token) {
  window.location.href = "dashboard.html";
}

/* 🔒 SHA256 */
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/* 🔑 LOGIN */
async function login() {

  const usuario = document.getElementById("usuario").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const error = document.getElementById("error");

  if (!usuario || !pin) {
    error.innerText = "Ingresa usuario y PIN";
    return;
  }

  error.innerText = "Validando...";

  try {

    const pinHash = await sha256(pin);

    const res = await fetch(API, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        usuario,
        pin: pinHash
      })
    });

    const data = await res.json();

    if (data.status === "success") {

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "dashboard.html";

    } else {
      error.innerText = data.message || "Credenciales incorrectas";
    }

  } catch (e) {
    error.innerText = "Error de conexión";
  }
}
