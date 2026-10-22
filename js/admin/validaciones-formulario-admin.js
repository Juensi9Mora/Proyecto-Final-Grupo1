const formulario = document.getElementById("formulario-detalles");

//datos formulario
export function capturarDatos() {
  return {
    nombre: document.getElementById("nombre-cancha").value.trim(),
    categoria: document.getElementById("categoria").value,
    pais: document.getElementById("pais").value,
    ciudad: document.getElementById("ciudad").value,
    valor: Number(document.getElementById("valor").value),
    imagen: document.getElementById("imagen").files[0],
  };
}

// valida los datos de la cancha
export function validarCancha(cancha) {
  const errores = {};

  if (cancha.nombre.length < 5 || cancha.nombre.length > 60) {
    errores["nombre-cancha"] = "El nombre debe tener entre 5 y 60 caracteres.";
  }
  if (cancha.categoria === "") {
    errores.categoria = "Selecciona un deporte.";
  }
  if (cancha.pais === "") {
    errores.pais = "Selecciona un país.";
  }
  if (cancha.ciudad === "") {
    errores.ciudad = "Selecciona una ciudad.";
  }
  if (isNaN(cancha.valor) || cancha.valor <= 0) {
    errores.valor = "El valor por hora debe ser un número mayor que 0.";
  }
  if (!cancha.imagen) {
    errores.imagen = "Selecciona una imagen de la cancha.";
  } else if (!cancha.imagen.type.startsWith("image/")) {
    errores.imagen = "El archivo debe ser una imagen (.jpg, .png, .webp).";
  }
  return errores;
}
// muestra los errores debajo de cada campo
export function mostrarErrores(errores) {
  formulario.querySelectorAll("input, select").forEach((campo) => {
    campo.classList.remove("is-invalid", "is-valid");
    const aviso = campo.nextElementSibling;
    if (aviso && aviso.classList.contains("invalid-feedback")) aviso.remove();

    if (errores[campo.id]) {
      campo.classList.add("is-invalid");
      campo.insertAdjacentHTML(
        "afterend",
        `<div class="invalid-feedback">${errores[campo.id]}</div>`,
      );
    } else {
      campo.classList.add("is-valid");
    }
  });
}

// borra los mensajes y colores de error
export function limpiarErrores() {
  formulario
    .querySelectorAll(".invalid-feedback")
    .forEach((aviso) => aviso.remove());
  formulario.querySelectorAll(".is-invalid, .is-valid").forEach((campo) => {
    campo.classList.remove("is-invalid", "is-valid");
  });
}
