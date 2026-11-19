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

let detalle = document.getElementById("detalle");
let direccion = document.getElementById("direccion");
let contenedorMapaAdmin = document.getElementById("contenedor-mapa-admin");
let mapaAdmin = document.getElementById("mapa-admin");
let estadoMapaAdmin = document.getElementById("estado-mapa-admin");

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
    ocultarMapaAdmin();
    seccion.hidden = true;
    imagen.required = true;
    edicion = -1;
    limpiarErrores();
}

export function cargarCancha(cancha, indice) {
    edicion = indice;
    nombre.value = cancha.nombre;
    detalle.value = cancha.detalle || "";
    direccion.value = cancha.direccion || "";
    pais.value = cancha.pais;
    actualizarCiudades();
    ciudad.value = cancha.ciudad;
    categoria.value = cancha.categoria;
    actualizarSubcategorias();
    subcategoria.value = cancha.subcategoria || "";
    valor.value = cancha.valor;
    if (direccion.value) actualizarMapaAdmin();
    else ocultarMapaAdmin();
    imagen.required = false;
    vista.src = cancha.imagen;
    vista.hidden = false;
    titulo.textContent = "Actualizar cancha";
    guardar.textContent = "Guardar cambios";
    seccion.hidden = false;
}

function mostrarMapaAdmin(textoUbicacion) {
    if (!textoUbicacion) return;
    const consulta = encodeURIComponent(textoUbicacion);
    mapaAdmin.src = `https://www.google.com/maps?q=${consulta}&output=embed`;
    contenedorMapaAdmin.hidden = false;
    estadoMapaAdmin.textContent = "Mapa de la ubicación encontrada para esta dirección.";
}

function ocultarMapaAdmin() {
    contenedorMapaAdmin.hidden = true;
    mapaAdmin.removeAttribute("src");
    estadoMapaAdmin.textContent = "La ubicación se actualizará con la dirección ingresada.";
}

async function actualizarMapaAdmin() {
    const texto = direccion.value.trim();

    if (texto.length < 8 || !ciudad.value || !pais.value) {
        ocultarMapaAdmin();
        return;
    }

    estadoMapaAdmin.textContent = "Buscando la ubicación...";
    contenedorMapaAdmin.hidden = false;

    try {
        const resultado = await geocodificarDireccion(
            texto,
            ciudad.value,
            pais.value
        );

        if (!resultado) {
            mapaAdmin.removeAttribute("src");
            estadoMapaAdmin.textContent =
                "No se encontró la dirección. Verifica los datos ingresados.";
            return;
        }

        mostrarMapaAdmin(resultado.display_name);

    } catch (error) {
        console.error("Error al buscar la dirección:", error);

        mapaAdmin.removeAttribute("src");
        estadoMapaAdmin.textContent =
            "No fue posible consultar el mapa. Verifica tu conexión.";
    }
}

async function geocodificarDireccion(direccion, ciudad, pais) {
    const codigosPais = {
        Colombia: "co",
        Peru: "pe"
    };

    const nombrePais = pais === "Peru" ? "Perú" : pais;
    const consulta = `${direccion}, ${ciudad}, ${nombrePais}`;

    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=${codigosPais[pais]}&q=${encodeURIComponent(consulta)}`;
    const respuesta = await fetch(url, {
        headers: {
            "Accept-Language": "es"
        }
    });

    if (!respuesta.ok) {
        throw new Error(`Error HTTP ${respuesta.status}`);
    }

    const resultados = await respuesta.json();

    const normalizar = (texto) =>
        String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const ciudadBuscada = normalizar(ciudad);
    const paisBuscado = normalizar(nombrePais);

    return resultados.find((resultado) => {
        const a = resultado.address || {};

        const datosUbicacion = normalizar([
            a.city,
            a.town,
            a.village,
            a.municipality,
            a.county,
            a.state_district,
            a.state,
            resultado.display_name
        ].join(" "));

        const paisEncontrado = normalizar(a.country);

        return (
            paisEncontrado === paisBuscado &&
            datosUbicacion.includes(ciudadBuscada)
        );
    }) || null;
}

export function iniciarFormularios(administrador) {
    pais.addEventListener("change", () => {
        actualizarCiudades();
        ocultarMapaAdmin();
    });

    // La vista previa del mapa se actualiza al salir del campo de dirección.
    direccion.addEventListener("blur", actualizarMapaAdmin);
    direccion.addEventListener("change", actualizarMapaAdmin);
    ciudad.addEventListener("change", actualizarMapaAdmin);

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
        lector.onload = function () {

            previsualizacion.src = lector.result;
            previsualizacion.hidden = false;
        };

        lector.readAsDataURL(archivo);
    }

    imagen.addEventListener("change", () =>
        previsualizarImagen(imagen, vista)
    );

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        // Validaciones locales antes de consultar el servicio de geocodificación.
        let datos = capturarDatos();
        let errores = validarCancha(datos);
        if (edicion !== -1 && !datos.imagen) delete errores.imagen;
        mostrarErrores(errores);
        if (Object.keys(errores).length > 0) return;

        guardar.disabled = true;

        // Geocodifica la dirección y comprueba que pertenezca a la ciudad y país seleccionados.
        try {
            const resultado = await geocodificarDireccion(
                datos.direccion,
                datos.ciudad,
                datos.pais
            );

            if (!resultado) {
                mostrarErrores({
                    direccion:
                        `La dirección no coincide con ${datos.ciudad}, ${datos.pais}. Verifica la dirección ingresada.`
                });
                return;

            }
            // Mostrar ubicación encontrada.
            mostrarMapaAdmin(
                resultado.display_name || datos.direccion
            );

            // Guardar los datos.
            await procesarGuardado(datos, resultado);

        } catch (error) {
            console.error(
                "Error al guardar la cancha:",
                error
            );

            mostrarErrores({
                direccion:
                    "No fue posible validar la dirección. Comprueba tu conexión e inténtalo nuevamente."
            });

        } finally {
            guardar.disabled = false;
        }

    });

    async function procesarGuardado(datos, ubicacionEncontrada) {

        const canchaAnterior =
            edicion === -1
                ? null
                : administrador.canchas[edicion];

        const activa = canchaAnterior
            ? canchaAnterior.activa
            : true;

        // Mantener la imagen anterior cuando se edita.
        const imagenActual = canchaAnterior
            ? canchaAnterior.imagen
            : "../img/Cancha-Futbol.webp";

        let imagenGuardada = imagenActual;

        // Si se seleccionó una imagen nueva, leerla.
        if (datos.imagen) {

            imagenGuardada = await new Promise((resolve, reject) => {

                const lector = new FileReader();
                lector.onload = () => resolve(lector.result);
                lector.onerror = () =>
                    reject(new Error("No se pudo leer la imagen."));
                lector.readAsDataURL(datos.imagen);
            });

        }

        // Conservar la imagen de deporte anterior.
        const balonGuardado =
            canchaAnterior?.balon || "../img/Balon-2.webp";

        // Crear el objeto de la cancha con todos los datos.
        const cancha = new Cancha(
            datos.nombre,
            datos.pais,
            datos.ciudad,
            datos.categoria,
            MONEDAS[datos.pais],
            datos.valor,
            imagenGuardada,
            balonGuardado,
            datos.detalle,
            activa,
            datos.categoria === "Fútbol"
                ? datos.subcategoria
                : "",
            datos.direccion
        );

        // Guardar o actualizar.
        administrador.guardarCancha(cancha, edicion);

        console.log(
            "Cancha guardada:",
            JSON.stringify(
                administrador.canchas.map(
                    ({ imagen, ...datos }) => datos
                ),
                null,
                2
            )
        );

        nombreInicial.value = cancha.nombre;
        limpiar();

    }

    cancelar.addEventListener("click", limpiar);

    cargarCategorias();
    actualizarCiudades();
    actualizarSubcategorias();
}