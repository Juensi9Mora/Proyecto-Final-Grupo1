const formulario = document.getElementById("formulario-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");

// captura los datos del formulario de registro
function capturarDatos() {
    return {
        nombre: document.getElementById("nombre").value.trim(),
        telefono: document.getElementById("telefono").value.replaceAll(" ", ""),
        correo: document.getElementById("correo-registro").value.trim().toLowerCase(),
        contrasena: document.getElementById("contrasena-registro").value,
        confirmar: document.getElementById("confirmar-contrasena").value,
    };
}

// valida los datos y devuelve los errores por id de campo
function validarRegistro(datos) {
    const errores = {};
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const regexTelefono = /^\+?\d{7,15}$/;

    if (datos.nombre.length < 3 || datos.nombre.length > 60) {
        errores.nombre = "El nombre debe tener entre 3 y 60 caracteres.";
    }

    if (!regexTelefono.test(datos.telefono)) {
        errores.telefono = "Ingresa un teléfono válido, solo números (7 a 15 dígitos).";
    }

    if (!regexCorreo.test(datos.correo)) {
        errores["correo-registro"] = "Ingresa un correo electrónico válido.";
    }

    if (datos.contrasena.length < 8) {
        errores["contrasena-registro"] = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (datos.confirmar !== datos.contrasena) {
        errores["confirmar-contrasena"] = "Las contraseñas no coinciden.";
    }

    return errores;
}

// muestra los errores debajo de cada campo
function mostrarErrores(errores) {
    formulario.querySelectorAll("input").forEach((campo) => {
        campo.classList.remove("is-invalid", "is-valid");
        const aviso = campo.nextElementSibling;
        if (aviso && aviso.classList.contains("invalid-feedback")) aviso.remove();

        if (errores[campo.id]) {
            campo.classList.add("is-invalid");
            campo.insertAdjacentHTML("afterend", `<div class="invalid-feedback">${errores[campo.id]}</div>`);
        } else {
            campo.classList.add("is-valid");
        }
    });
}

    // se quita colores despues de la validacion despues de limpiar el formulario (modificado)
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(),
        mensajeRegistro.textContent = "";

        const datos = capturarDatos();
        const errores = validarRegistro(datos);
        mostrarErrores(errores);

            if (Object.keys(errores).length > 0) return;

        const usuario = {
            nombre: datos.nombre,
            telefono: datos.telefono,
            correo: datos.correo,
            contrasena: datos.contrasena,
        };

        const { contrasena, ...usuarioSinClave } = usuario;
        console.log(JSON.stringify(usuarioSinClave, null, 2));
        
        //queda guardado de manera real el usuario en el backend (revisar cambio)

        formulario.reset();
        limpiarEstado();
        mensajeRegistro.textContent = "Registro completado. Ya puedes iniciar sesion.";
        mensajeRegistro.className = "mensaje mensaje-ok";
    });
