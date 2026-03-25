const API = "https://script.google.com/macros/s/AKfycbzgEPsvOqOF2EH8dnAC3uk8_AyoRBa6egTNiXrJTFKhPzV9-BgEnVMGAHCKwY4SRV0d/exec";

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
