const formulario = document.getElementById("formulario-detalles");

// Capturar datos del formulario
export function capturarDatos() {
  const campoImagen = document.getElementById("imagen");

  return {
    nombre: document.getElementById("nombre-cancha").value.trim(),
    categoria: document.getElementById("categoria").value,
    subcategoria: document.getElementById("subcategoria").value,
    pais: document.getElementById("pais").value,
    ciudad: document.getElementById("ciudad").value,
    direccion: document.getElementById("direccion").value.trim(),
    detalle: document.getElementById("detalle").value.trim(),
    moneda: document.getElementById("moneda").value,
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
  if (cancha.categoria === "Fútbol" && cancha.subcategoria === "") {
    errores.subcategoria = "Selecciona una subcategoría de fútbol.";
  }
  if (cancha.pais === "") {
    errores.pais = "Selecciona un país.";
  }
  if (cancha.ciudad === "") {
    errores.ciudad = "Selecciona una ciudad.";
  }
  if (!cancha.direccion || cancha.direccion.length < 8) {
    errores.direccion = "Ingresa una dirección completa de la cancha.";
  }
  if (cancha.moneda === "") {
    errores.moneda = "Selecciona una moneda.";
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
  formulario.querySelectorAll("input, select, textarea").forEach((campo) => {
    campo.classList.remove("is-invalid", "is-valid");
    const aviso = campo.nextElementSibling;
    if (aviso && aviso.classList.contains("invalid-feedback")) {
      aviso.remove();
    }

    if (errores[campo.id]) {
      campo.classList.add("is-invalid");
      campo.insertAdjacentHTML(
        "afterend",
        `<div class="invalid-feedback">${errores[campo.id]}</div>`,
      );
    } else if (campo.required || campo.value !== "") {
      campo.classList.add("is-valid");
    }
  });
}

// Limpiar los mensajes y colores de error
export function limpiarErrores() {
  formulario.querySelectorAll(".invalid-feedback")
    .forEach((aviso) => aviso.remove());
  formulario.querySelectorAll(".is-invalid, .is-valid").forEach((campo) => {
    campo.classList.remove("is-invalid", "is-valid");
  });
}