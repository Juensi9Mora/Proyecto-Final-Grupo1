import { buscarUsuarioPorCorreo, crearSal, hashearContrasena } from "./validaciones-registro.js";

const formulario = document.getElementById("formulario-restablecer");
const campoCorreo = document.getElementById("correo-restablecer");
const mensaje = document.getElementById("mensaje-restablecer");
const regexCorreo = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensaje.textContent = "";
    mensaje.className = "mensaje";
    campoCorreo.classList.remove("is-invalid", "is-valid");

    const correo = campoCorreo.value.trim().toLowerCase();
    if (!regexCorreo.test(correo)) {
        campoCorreo.classList.add("is-invalid");
        return;
    }

    const usuario = buscarUsuarioPorCorreo(correo);
    if (!usuario) {
        mensaje.textContent = "Si el correo está registrado, recibirás instrucciones para restablecer tu clave.";
        mensaje.className = "mensaje mensaje-ok";
        formulario.reset();
        return;
    }

    // Flujo práctico para demo frontend: solicitar nueva contraseña
    const nuevaClave = prompt(`Hola ${usuario.nombre}, escribe tu nueva contraseña (mínimo 8 caracteres):`);
    if (!nuevaClave || nuevaClave.length < 8) {
        mensaje.textContent = "La nueva contraseña debe tener al menos 8 caracteres.";
        mensaje.className = "mensaje mensaje-error";
        return;
    }

    const nuevaSal = crearSal();
    const nuevoHash = await hashearContrasena(nuevaClave, nuevaSal);

    const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");
    const index = usuarios.findIndex(u => u.id === usuario.id);
    if (index !== -1) {
        usuarios[index].sal = nuevaSal;
        usuarios[index].contrasenaHash = nuevoHash;
        localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    }

    formulario.reset();
    mensaje.textContent = "Contraseña actualizada correctamente. Ya puedes iniciar sesión.";
    mensaje.className = "mensaje mensaje-ok";
});
