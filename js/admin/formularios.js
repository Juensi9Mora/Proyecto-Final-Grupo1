import { Cancha } from "./cancha.js";
import { CANCHAS_BASE } from "../services/canchasService.js";
import { capturarDatos, validarCancha, mostrarErrores, limpiarErrores } from "./validaciones-formulario-admin.js";

const MONEDAS = { Colombia: "COP", Peru: "PEN" };
let formularioInicial = document.getElementById("formulario-inicial");
let formulario = document.getElementById("formulario-detalles");
let seccion = document.getElementById("seccion-detalles");

let nombreInicial = document.getElementById("nombre-inicial");
let nombre = document.getElementById("nombre-cancha");

let imagen = document.getElementById("imagen");
let vista = document.getElementById("vista-imagen");

let balon = document.getElementById("balon");
let vistaBalon = document.getElementById("vista-balon");

let detalle = document.getElementById("detalle");

let pais = document.getElementById("pais");
let ciudad = document.getElementById("ciudad");
let categoria = document.getElementById("categoria");

let contenedorSubcategoria = document.getElementById("contenedor-subcategoria");
let subcategoria = document.getElementById("subcategoria");

let moneda = document.getElementById("moneda");
let valor = document.getElementById("valor");

let titulo = document.getElementById("titulo-detalles");
let guardar = document.getElementById("guardar");
let cancelar = document.getElementById("cancelar");
let edicion = -1;

function cargarCategorias() {
    let categorias = [];

    CANCHAS_BASE.forEach((cancha) => {
        if (!categorias.includes(cancha.deporte)) {
            categorias.push(cancha.deporte);
        }

    });

    categoria.innerHTML =
        '<option value="">Selecciona una categoría</option>';

    categorias.sort((a, b) => a.localeCompare(b, "es"))
        .forEach((deporte) => {

            categoria.innerHTML +=
                `<option value="${deporte}">${deporte}</option>`;

        });
}

function actualizarSubcategorias() {

    if (categoria.value === "Fútbol") {
        contenedorSubcategoria.hidden = false;
        subcategoria.disabled = false;
    } else {
        contenedorSubcategoria.hidden = true;
        subcategoria.disabled = true;
        subcategoria.value = "";
    }
}

function actualizarCiudades() {
    ciudad.innerHTML = '<option value="">Selecciona una ciudad</option>';

    if (pais.value === "Colombia") {
        ciudad.innerHTML += '<option>Bogotá</option><option>Medellín</option>';
    } else if (pais.value === "Peru") {
        ciudad.innerHTML += '<option>Lima</option><option>Arequipa</option>';
    } 

    moneda.value = MONEDAS[pais.value] || "";
        
}

function limpiar() {
    formulario.reset();

    vista.hidden = true;
    vista.removeAttribute("src");
    vistaBalon.hidden = true;
    vistaBalon.removeAttribute("src");
    seccion.hidden = true;
    imagen.required = true;
    edicion = -1;
    limpiarErrores();
}

export function cargarCancha(cancha, indice) {
    edicion = indice;
    nombre.value = cancha.nombre;
    detalle.value = cancha.detalle || "";
    pais.value = cancha.pais;
    actualizarCiudades();
    ciudad.value = cancha.ciudad;
    categoria.value = cancha.categoria;
    valor.value = cancha.valor;
    imagen.required = false;
    vista.src = cancha.imagen;
    vista.hidden = false;
    titulo.textContent = "Actualizar cancha";
    guardar.textContent = "Guardar cambios";
    seccion.hidden = false;

    if (cancha.balon) {
        vistaBalon.src = cancha.balon;
        vistaBalon.hidden = false;
    }

    titulo.textContent = "Actualizar cancha";
    guardar.textContent = "Guardar cambios";
    seccion.hidden = false;
}

export function iniciarFormularios(administrador) {
    pais.addEventListener("change", actualizarCiudades);

    categoria.addEventListener("change", () => {
        actualizarSubcategorias();
        limpiarErrores();

    });

    formularioInicial.addEventListener("submit", (evento) => {
        evento.preventDefault();
        limpiar();
        nombre.value = nombreInicial.value.trim();
        titulo.textContent = "Información de la cancha";
        guardar.textContent = "Guardar";
        actualizarCiudades();
        seccion.hidden = false;
    });

    function previsualizarImagen(campo, previsualizacion) {
        let archivo = campo.files[0];

        if (!archivo) return;
        if (!archivo.type.startsWith("image/")) {
            alert("Selecciona una imagen válida.");
            campo.value = "";
            return;
        }

        let lector = new FileReader();
        lector.onload = function() {

            previsualizacion.src = lector.result;
            previsualizacion.hidden = false;
        };

        lector.readAsDataURL(archivo);
    }

    imagen.addEventListener("change", () =>
        previsualizarImagen(imagen, vista)
    );

    balon.addEventListener("change", () =>
        previsualizarImagen(balon, vistaBalon)
    );

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        // validaciones
        let errores = validarCancha(capturarDatos());
        if (edicion !== -1) delete errores.imagen;
        mostrarErrores(errores);
        if (Object.keys(errores).length > 0) return;

        let archivo = imagen.files[0];
        let archivoBalon = balon.files[0];

        function guardarDatos(foto, fotoBalon) {
            let canchaAnterior = edicion === -1 ? null : administrador.canchas[edicion];
            let activa = canchaAnterior ? canchaAnterior.activa: true;

            let cancha = new Cancha(
            nombre.value.trim(),
            pais.value,
            ciudad.value,
            categoria.value,
            MONEDAS[pais.value],
            Number(valor.value),
            foto,
            fotoBalon,
            detalle.value.trim(),
            activa,
            categoria.value === "Fútbol" ? subcategoria.value : ""
        );

            administrador.guardarCancha(cancha, edicion);
            console.log(JSON.stringify(administrador.canchas.map(({ imagen, ...datos }) => datos), null, 2));
            nombreInicial.value = cancha.nombre;
            limpiar();
        }

         let fotoActual = edicion === -1
            ? "../img/Cancha-Futbol.webp"
            : administrador.canchas[edicion].imagen;

        let balonActual = edicion === -1
            ? "../img/Balon-2.webp"
            : (
                administrador.canchas[edicion].balon ||
                "../img/Balon-2.webp"
            );

        function guardarConImagenes(foto, fotoDeporte) {

            if (archivoBalon) {
                let lectorBalon = new FileReader();
                lectorBalon.onload = () =>
                    guardarDatos(foto, lectorBalon.result);
                lectorBalon.readAsDataURL(archivoBalon);
            } else {
                guardarDatos(foto, fotoDeporte);
            }
        }

        if (archivo) {
            let lector = new FileReader();
            lector.onload = () =>
                guardarConImagenes(lector.result, balonActual);
            lector.readAsDataURL(archivo);
        } else {
            guardarConImagenes(fotoActual, balonActual);
        }

    });

    cancelar.addEventListener("click", limpiar);

    cargarCategorias();
    actualizarCiudades();
    actualizarSubcategorias();
}