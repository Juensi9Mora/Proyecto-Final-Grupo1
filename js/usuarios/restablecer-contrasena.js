const formulario = document.getElementById("formulario-restablecer");
const campoCorreo = document.getElementById("correo-restablecer");
const mensaje = document.getElementById("mensaje-restablecer");

const regexCorreo = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // limpia los avisos anteriores
    mensaje.textContent = "";
    mensaje.className = "mensaje";
    campoCorreo.classList.remove("is-invalid", "is-valid");
    const aviso = campoCorreo.nextElementSibling;
    if (aviso && aviso.classList.contains("invalid-feedback")) aviso.remove();

    const correo = campoCorreo.value.trim().toLowerCase();

    if (!regexCorreo.test(correo)) {
        campoCorreo.classList.add("is-invalid");
        campoCorreo.insertAdjacentHTML(
            "afterend",
            `<div class="invalid-feedback">Ingresa un correo electrónico válido.</div>`
        );
        return;
    }

    // aqui debe ir el enlace de recuperación en el backend)

    formulario.reset();
    mensaje.textContent = "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.";
    mensaje.className = "mensaje mensaje-ok";
});