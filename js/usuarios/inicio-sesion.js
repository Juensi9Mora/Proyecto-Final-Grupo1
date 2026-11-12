import { correoYaRegistrado, registrarUsuario, buscarUsuarioPorCorreo, hashearContrasena } from
  "./validaciones-registro.js";

// usuarios pre-almacenados
const usuariosIniciales = [
    { nombre: "Administrador", telefono: "3001234567", correo: "admin@micancha.com", contrasena: "Admin12345" },
    { nombre: "Usuario Prueba", telefono: "3009876543", correo: "prueba@micancha.com", contrasena: "Prueba12345" },
];

// crea cada usuario solo si todavía no existe
try {
    for (const usuario of usuariosIniciales) {
        if (!correoYaRegistrado(usuario.correo)) {
            await registrarUsuario(usuario);
        }
    }
} catch (error) {
    console.error("No se pudieron crear los usuarios iniciales:", error.message);
}

const formularioLogin = document.getElementById("formulario-login");

// captura lo que escribió el usuario
function capturarLogin() {
    return {
        correo: document.getElementById("correo-login").value.trim().toLowerCase(),
        contrasena: document.getElementById("contrasena-login").value,
    };
}

// revisa campos vacíos y devuelve los errores por id de campo
function validarLogin(datos) {
    const errores = {};

    if (datos.correo === "") {
        errores["correo-login"] = "Ingresa tu correo electrónico.";
    }

    if (datos.contrasena === "") {
        errores["contrasena-login"] = "Ingresa tu contraseña.";
    }

    return errores;
}

  // busca el usuario en localStorage y compara la contraseña (funcion de autenticación)
  async function autenticar(correo, contrasena) {
      const usuario = buscarUsuarioPorCorreo(correo);
       if (!usuario) return null;
       const hash = await hashearContrasena(contrasena, usuario.sal);
       if (hash !== usuario.contrasenaHash) return null; 
        return usuario;
  }

// muestra los errores debajo de cada campo
function mostrarErroresLogin(errores) {
    formularioLogin.querySelectorAll("input").forEach((campo) => {
        campo.classList.remove("is-invalid");
        const aviso = campo.nextElementSibling;
        if (aviso && aviso.classList.contains("invalid-feedback")) aviso.remove();

        if (errores[campo.id]) {
            campo.classList.add("is-invalid");
            campo.insertAdjacentHTML("afterend", `<div class="invalid-feedback">${errores[campo.id]}</div>`);
        }
    });
}

//esta funcion se usa en el submit
  const mensajeLogin = document.getElementById("mensaje-login");

  formularioLogin.addEventListener("submit", async (evento) => {
      evento.preventDefault();
      mensajeLogin.textContent = "";
      mensajeLogin.className = "mensaje";

      const datos = capturarLogin();
      const errores = validarLogin(datos);
      mostrarErroresLogin(errores);

      if (Object.keys(errores).length > 0) return;  // campos vacíos → se detiene aquí

      const usuario = await autenticar(datos.correo, datos.contrasena);

      if (!usuario) {
          mensajeLogin.textContent = "Usuario o contraseña inválidos.";
          mensajeLogin.className = "mensaje mensaje-error";
          return;
      }
        // guarda quién inició sesión (sin la contraseña)
      localStorage.setItem("usuarioActivo", JSON.stringify({ nombre: usuario.nombre, correo:
  usuario.correo }));

      mensajeLogin.textContent = `¡Bienvenido, ${usuario.nombre}!`;
      mensajeLogin.className = "mensaje mensaje-ok";
      alert(`Inicio de sesión exitoso. ¡Hola, ${usuario.nombre}!`);
  });
