const formulario = document.getElementById("formulario-registro");
const mensajeRegistro = document.getElementById("mensaje-registro");


const CLAVE_USUARIOS = "usuariosRegistrados";


export function obtenerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch {
        return [];
    }
}


function guardarUsuarios(lista) {
    try {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
    } catch {
        throw new Error("No pudimos guardar tu registro en este navegador.");
    }
}


export function buscarUsuarioPorCorreo(correo) {
    const buscado = correo.trim().toLowerCase();
    return obtenerUsuarios().find((usuario) => usuario.correo === buscado);
}

export const correoYaRegistrado = (correo) => Boolean(buscarUsuarioPorCorreo(correo));

/* la contraseña nunca se guarda en texto plano: se guarda un hash con sal (PBKDF2).
   Exportada para que el login pueda comparar con la misma fórmula. */
const codificar = new TextEncoder();
const aHex = (bytes) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");

export const crearSal = () => aHex(crypto.getRandomValues(new Uint8Array(16)));

export async function hashearContrasena(contrasena, sal) {
    const material = await crypto.subtle.importKey("raw", codificar.encode(contrasena), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: codificar.encode(sal), iterations: 100000, hash: "SHA-256" },
        material,
        256
    );
    return aHex(bits);
}

export async function registrarUsuario(datos) {
    if (!globalThis.crypto?.subtle) {
        throw new Error("Para registrarte abre el sitio desde https o localhost.");
    }

    if (correoYaRegistrado(datos.correo)) {
        throw new Error("Este correo ya está registrado. Inicia sesión.");
    }

    const sal = crearSal();
    const usuario = {
        id: crypto.randomUUID(),
        nombre: datos.nombre,
        telefono: datos.telefono,
        correo: datos.correo,
        sal,
        contrasenaHash: await hashearContrasena(datos.contrasena, sal),
        creado: new Date().toISOString(),
    };

    guardarUsuarios([...obtenerUsuarios(), usuario]);

    const { sal: _sal, contrasenaHash: _hash, ...publico } = usuario;
    return publico;
}


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
    } else if (correoYaRegistrado(datos.correo)) {
        errores["correo-registro"] = "Este correo ya está registrado. Inicia sesión.";
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

// quita los colores y mensajes de validación (se usa después de limpiar el formulario)
function limpiarEstado() {
    formulario.querySelectorAll(".invalid-feedback").forEach((aviso) => aviso.remove());
    formulario.querySelectorAll(".is-invalid, .is-valid").forEach((campo) => {
        campo.classList.remove("is-invalid", "is-valid");
    });
}

// el "if" permite importar las funciones de arriba desde otras páginas (por ejemplo el login)
if (formulario) {
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        mensajeRegistro.textContent = "";
        mensajeRegistro.className = "mensaje";

        const datos = capturarDatos();
        const errores = validarRegistro(datos);
        mostrarErrores(errores);

        if (Object.keys(errores).length > 0) return;

        try {
            const usuario = await registrarUsuario(datos);
            console.log(JSON.stringify(usuario, null, 2));

            // cuando exista el backend, aquí se envía el usuario al servidor en lugar de localStorage

            formulario.reset();
            limpiarEstado();
            mensajeRegistro.textContent = "Registro completado. Ya puedes iniciar sesión.";
            mensajeRegistro.className = "mensaje mensaje-ok";
        } catch (error) {
            mensajeRegistro.textContent = error.message;
            mensajeRegistro.className = "mensaje mensaje-error";
        }
    });
}