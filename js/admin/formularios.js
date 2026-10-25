import { Cancha } from "./cancha.js";

const MONEDAS = { Colombia: "COP", Peru: "PEN" };
let formularioInicial = document.getElementById("formulario-inicial");
let formulario = document.getElementById("formulario-detalles");
let seccion = document.getElementById("seccion-detalles");
let nombreInicial = document.getElementById("nombre-inicial");
let nombre = document.getElementById("nombre-cancha");
let imagen = document.getElementById("imagen");
let vista = document.getElementById("vista-imagen");
let pais = document.getElementById("pais");
let ciudad = document.getElementById("ciudad");
let categoria = document.getElementById("categoria");
let moneda = document.getElementById("moneda");
let valor = document.getElementById("valor");
let titulo = document.getElementById("titulo-detalles");
let guardar = document.getElementById("guardar");
let cancelar = document.getElementById("cancelar");
let edicion = -1;

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
    vista.hidden = seccion.hidden = true;
    imagen.required = true;
    edicion = -1;
}

export function cargarCancha(cancha, indice) {
    edicion = indice;
    nombre.value = cancha.nombre;
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
}

export function iniciarFormularios(administrador) {
    pais.addEventListener("change", actualizarCiudades);

    formularioInicial.addEventListener("submit", function(evento) {
        evento.preventDefault();
        limpiar();
        nombre.value = nombreInicial.value.trim();
        titulo.textContent = "Información de la cancha";
        guardar.textContent = "Guardar";
        actualizarCiudades();
        seccion.hidden = false;
    });

    imagen.addEventListener("change", function() {
        let archivo = imagen.files[0];
        if (!archivo) return;

        if (!archivo.type.startsWith("image/")) {
            alert("Selecciona una imagen válida.");
            imagen.value = "";
            return;
        }

        let lector = new FileReader();
        lector.onload = function() {
            vista.src = lector.result;
            vista.hidden = false;
        };
        lector.readAsDataURL(archivo);
    });

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();
        let archivo = imagen.files[0];

        if (!archivo && edicion === -1) {
            alert("Selecciona una imagen.");
            return;
        }

        function guardarDatos(foto) {
            let activa = edicion === -1 ? true : administrador.canchas[edicion].activa;
            let cancha = new Cancha(nombre.value.trim(), pais.value, ciudad.value,
                categoria.value, MONEDAS[pais.value], Number(valor.value), foto, activa);

            administrador.guardarCancha(cancha, edicion);
            nombreInicial.value = cancha.nombre;
            limpiar();
        }

        if (!archivo) {
            guardarDatos(administrador.canchas[edicion].imagen);
        } else if (archivo.type.startsWith("image/")) {
            let lector = new FileReader();
            lector.onload = function() { guardarDatos(lector.result); };
            lector.readAsDataURL(archivo);
        } else alert("Selecciona una imagen válida.");
    });

    cancelar.addEventListener("click", limpiar);
    actualizarCiudades();
}