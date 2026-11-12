import { crearId } from "./services/canchasService.js";

// se reemplaza con el url de la imagen
// aqui f_auto elige el mejor formato, q_auto ajusta la calidad
// y w_ reduce el ancho al tamaño que realmente se ve en pantalla.
const CLOUDINARY = "https://res.cloudinary.com/hg1j7l69/image/upload";
const ANCHO_FOTO = 600;   // foto de la tarjeta
const ANCHO_BALON = 300;  // imagen del reverso

function img(id, ancho) {
    return `${CLOUDINARY}/f_auto,q_auto,w_${ancho}/${id}`;
}

// Crear listas por cancha
const canchas = [
    // Baloncesto Colombia
    { nombre: "Cancha El Paraiso", ciudad: "Medellín", pais: "Colombia", precio: "COP 60.000 / hora", imagen: img("Cancha-Baloncesto", ANCHO_FOTO), balon: img("aro", ANCHO_BALON), deporte: "Baloncesto" },
    // Futbol Colombia
    { nombre: "Cancha Marbella", ciudad: "Bogotá", pais: "Colombia", precio: "COP 90.000 / hora", imagen: img("Cancha-Futbol", ANCHO_FOTO), balon: img("Balon-Futbol", ANCHO_BALON), deporte: "Fútbol" },
    // Volleyball Colombia
    { nombre: "Cancha El Remate", ciudad: "Medellin", pais: "Colombia", precio: "COP 70.000 / hora", imagen: img("Cancha-Volley", ANCHO_FOTO), balon: img("Balon-Volley", ANCHO_BALON), deporte: "Volleyball" },
    // Tenis Colombia
    { nombre: "Cancha El Salitre", ciudad: "Bogotá", pais: "Colombia", precio: "COP 150.000 / hora", imagen: img("Cancha-Tenis", ANCHO_FOTO), balon: img("pelota-tenis", ANCHO_BALON), deporte: "Tennis" },
    // Futsal Colombia
    { nombre: "Cancha Arena 7", ciudad: "Bogotá", pais: "Colombia", precio: "COP 80.000 / hora", imagen: img("futsal", ANCHO_FOTO), balon: img("Futsal1", ANCHO_BALON), deporte: "Futsal" },
    // NFL Colombia
    { nombre: "Cancha SanCristobal", ciudad: "Medellin", pais: "Colombia", precio: "COP 180.000 / hora", imagen: img("Cancha-Americano", ANCHO_FOTO), balon: img("Balon-Americano", ANCHO_BALON), deporte: "Futbol Americano" },
    // MLB Colombia
    { nombre: "Cancha Jardines", ciudad: "Bogotá", pais: "Colombia", precio: "COP 180.000 / hora", imagen: img("Cancha-Beisbol", ANCHO_FOTO), balon: img("Pelota-Beisbol", ANCHO_BALON), deporte: "Beisbol" },
    // Volleyball Peru
    { nombre: "Coliseo Arequipa", ciudad: "Arequipa", pais: "Perú", precio: "PEN 80.00 / hora", imagen: img("Cancha-Volley", ANCHO_FOTO), balon: img("VolleyB", ANCHO_BALON), deporte: "Voley" },
    // Baloncesto Peru
    { nombre: "Cancha Elbows", ciudad: "Lima", pais: "Perú", precio: "PEN 180.000 / hora", imagen: img("Baloncesto", ANCHO_FOTO), balon: img("Balon-Baloncesto", ANCHO_BALON), deporte: "Baloncesto" },
    // Futbol Peru
    { nombre: "Cancha DeporGol", ciudad: "Arequipa", pais: "Perú", precio: "PEN 90.00 / hora", imagen: img("Futbol", ANCHO_FOTO), balon: img("Balon-2", ANCHO_BALON), deporte: "Fútbol" },
    // Balonmano Peru
    { nombre: "Cancha Campo de Marte", ciudad: "Lima", pais: "Perú", precio: "PEN 100.00 / hora", imagen: img("Cancha-Balon-mano", ANCHO_FOTO), balon: img("Balon-Mano", ANCHO_BALON), deporte: "Balón mano" },
    // Tenis Perú
    { nombre: "Cancha TenniSport", ciudad: "Lima", pais: "Perú", precio: "PEN 200.00 / hora", imagen: img("Tenis", ANCHO_FOTO), balon: img("TenisP", ANCHO_BALON), deporte: "Tennis" },
    // MLB Perú
    { nombre: "Cancha RedDiamond ", ciudad: "Arequipa", pais: "Perú", precio: "PEN 180.00 / hora", imagen: img("Beisbol", ANCHO_FOTO), balon: img("beisbolC", ANCHO_BALON), deporte: "Beisbol" },
    // NFL Peru
    { nombre: "El Centinela", ciudad: "Lima", pais: "Perú", precio: "PEN 190.00 / hora", imagen: img("NFL", ANCHO_FOTO), balon: img("NFLC", ANCHO_BALON), deporte: "Futbol Americano" },
];

//pendiente aplicar loading="lazy" dado que sea mejor que la opcion anterior respectivo a la seguridad de la pagina
// Crear listas por cancha
// const canchas = [
//     // Baloncesto Colombia
//     { nombre: "Cancha El Paraiso", ciudad: "Medellín", pais: "Colombia", precio: "COP 60.000 / hora", imagen: "../img/Cancha-Baloncesto.webp", balon: "../img/aro.webp", deporte: "Baloncesto" },
//     // Futbol Colombia
//     { nombre: "Cancha Marbella", ciudad: "Bogotá", pais: "Colombia", precio: "COP 90.000 / hora", imagen: "../img/Cancha-Futbol.webp", balon: "../img/Balon-Futbol.webp", deporte: "Fútbol" },
//     // Volleyball Colombia
//     { nombre: "Cancha El Remate", ciudad: "Medellin", pais: "Colombia", precio: "COP 70.000 / hora", imagen: "../img/Cancha-Volley.webp", balon: "../img/Balon-Volley.webp", deporte: "Volleyball" },
//     // Tenis Colombia
//     { nombre: "Cancha El Salitre", ciudad: "Bogotá", pais: "Colombia", precio: "COP 150.000 / hora", imagen: "../img/Cancha-Tenis.webp", balon: "../img/pelota-tenis.webp", deporte: "Tennis" },
//     // Futsal Colombia
//     { nombre: "Cancha Arena 7", ciudad: "Bogotá", pais: "Colombia", precio: "COP 80.000 / hora", imagen: "../img/futsal.webp", balon: "../img/Futsal-1.webp", deporte: "Futsal" },
//     // NFL Colombia
//     { nombre: "Cancha SanCristobal", ciudad: "Medellin", pais: "Colombia", precio: "COP 180.000 / hora", imagen: "../img/Cancha-Americano.webp", balon: "../img/Balon-Americano.webp", deporte: "Futbol Americano" },
//     // MLB Colombia
//     { nombre: "Cancha Jardines", ciudad: "Bogotá", pais: "Colombia", precio: "COP 180.000 / hora", imagen: "../img/Cancha-Beisbol.webp", balon: "../img/Pelota-Beisbol.webp", deporte: "Beisbol" },
//     // Volleyball Peru
//     { nombre: "Coliseo Arequipa", ciudad: "Arequipa", pais: "Perú", precio: "PEN 80.00 / hora", imagen: "../img/Cancha-Volley.webp", balon: "../img/VolleyB.webp", deporte: "Voley" },
//     // Baloncesto Peru
//     { nombre: "Cancha Elbows", ciudad: "Lima", pais: "Perú", precio: "PEN 180.000 / hora", imagen: "../img/Baloncesto.webp", balon: "../img/Balon-Baloncesto.webp", deporte: "Baloncesto" },
//     // Futbol Peru
//     { nombre: "Cancha DeporGol", ciudad: "Arequipa", pais: "Perú", precio: "PEN 90.00 / hora", imagen: "../img/Futbol.webp", balon: "../img/Balon-2.webp", deporte: "Fútbol" },
//     // Balonmano Peru
//     { nombre: "Cancha Campo de Marte", ciudad: "Lima", pais: "Perú", precio: "PEN 100.00 / hora", imagen: "../img/Cancha-Balon-mano.webp", balon: "../img/Balon-Mano.webp", deporte: "Balón mano" },
//     // Tenis Perú
//     { nombre: "Cancha TenniSport", ciudad: "Lima", pais: "Perú", precio: "PEN 200.00 / hora", imagen: "../img/Tenis.webp", balon: "../img/TenisP.webp", deporte: "Tennis" },
//     // MLB Perú
//     { nombre: "Cancha RedDiamond ", ciudad: "Arequipa", pais: "Perú", precio: "PEN 180.00 / hora", imagen: "../img/Beisbol.webp", balon: "../img/BeisbolC.webp", deporte: "Beisbol" },
//     // NFL Peru
//     { nombre: "El Centinela", ciudad: "Lima", pais: "Perú", precio: "PEN 190.00 / hora", imagen: "../img/NFL.webp", balon: "../img/NFLC.webp", deporte: "Futbol Americano" },
// ];

// Subcategorías disponibles para Fútbol
const categoriasFutbol = [
    "Fútbol 5",
    "Fútbol 7",
    "Fútbol 8",
    "Fútbol 11"
];

// Se visualizo 4 tarjetas por página (2 x 2, como en el boceto de figma)
// pero el resultado final no queda bien revisar que cubra 3 por linea o revisar desde otro dispositivo
// la vista desde el celular se sigue viendo muy grande :/
const POR_PAGINA = 4;
let paginaActual = 1;

// Para los filtros y funcion de pasar de pagina se ejecuta con get desde elementos del HTML
const galeria = document.getElementById("galeria-canchas");
const textoResultado = document.getElementById("resultado-texto");
const paginaInfo = document.getElementById("pagina-info");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const btnLimpiar = document.getElementById("btn-limpiar");
const filtroDeporte = document.getElementById("filtro-deporte");
const filtroPais = document.getElementById("filtro-pais");

const contenedorFiltroSubcategoria = document.getElementById("contenedor-filtro-subcategoria");
const filtroSubcategoria = document.getElementById("filtro-subcategoria");

function cargarFiltroDeportes() {
    let deportes = [];

    // 1. Extraer deportes del array base
    canchas.forEach(cancha => {
        if (cancha.deporte && !deportes.includes(cancha.deporte)) {
            deportes.push(cancha.deporte);
        }
    });

    // 2. Extraer deportes del localStorage (panel admin)
    JSON.parse(localStorage.getItem("canchasMiCancha") || "[]").forEach(cancha => {
        const deporteAdmin = cancha.categoria || cancha.deporte;
        if (cancha.activa && deporteAdmin && !deportes.includes(deporteAdmin)) {
            deportes.push(deporteAdmin);
        }
    });

    // 3. Ordenar alfabéticamente
    deportes.sort((a, b) => a.localeCompare(b, "es"));

    // 4. Pintar opciones en el select
    filtroDeporte.innerHTML = '<option value="">Todos</option>';
    deportes.forEach(deporte => {
        filtroDeporte.insertAdjacentHTML(
            "beforeend",
            `<option value="${deporte}">${deporte}</option>`
        );
    });
}

function actualizarFiltroSubcategorias() {
    filtroSubcategoria.innerHTML ='<option value="">Todas las modalidades</option>';

    if (filtroDeporte.value === "Fútbol") {
        contenedorFiltroSubcategoria.hidden = false;
        filtroSubcategoria.disabled = false;

        categoriasFutbol.forEach((subcategoria) => {

            filtroSubcategoria.insertAdjacentHTML(
                "beforeend",
                `<option value="${subcategoria}">${subcategoria}</option>`
            );

        });

    } else {
        contenedorFiltroSubcategoria.hidden = true;
        filtroSubcategoria.disabled = true;
        filtroSubcategoria.value = "";
    }
}

function obtenerCanchasAdmin() {
    return JSON.parse(localStorage.getItem("canchasMiCancha")) || [];
}

// Unir las canchas originales con las del administrador
function obtenerTodasLasCanchas() {

    // Agregar país a las canchas originales sin modificar el array
    let canchasOriginales = canchas.map(cancha => ({
        ...cancha,
        pais: cancha.ciudad.includes("Perú") ? "Perú" : "Colombia",
        subcategoria: cancha.subcategoria || "",
        detalle: cancha.detalle || `Cancha deportiva para practicar ${cancha.deporte} en ${cancha.ciudad}`
    }));

    // Obtener registros del administrador
    let canchasAdmin = obtenerCanchasAdmin();

    // Preparar las canchas del administrador para el catálogo
    let canchasRegistradas = canchasAdmin
        .filter(cancha => cancha.activa)
        .map(cancha => ({
        nombre: cancha.nombre,
        ciudad: `${cancha.ciudad}, ${cancha.pais === "Peru" ? "Perú" : cancha.pais}`,
        pais: cancha.pais === "Peru" ? "Perú" : cancha.pais,
        precio: `${cancha.moneda} ${Number(cancha.valor).toLocaleString("es-CO")} / hora`,
        imagen: cancha.imagen,
        balon: cancha.balon || "../img/Balon-2.webp",
        deporte: cancha.categoria,
        subcategoria: cancha.subcategoria || "",
        detalle: (cancha.detalle && cancha.detalle !== "undefined") ? cancha.detalle : `Cancha deportiva ubicada en ${cancha.ciudad}`
    }));

    return [...canchasRegistradas, ...canchasOriginales];
}

// para filtrar se investiga como dejar solo las canchas que cumplen los filtros elegidos
function filtrarCanchas() {
    const deporte = filtroDeporte.value;
    const subcategoria = filtroSubcategoria.value;
    const pais = filtroPais.value;

    let todasLasCanchas = obtenerTodasLasCanchas();

    return todasLasCanchas.filter(cancha =>
        (deporte === "" || cancha.deporte === deporte) &&
        (subcategoria === "" || cancha.subcategoria === subcategoria) &&
        (pais === "" || cancha.pais === pais)
    );
}

// Se crea cada tarjeta con HTML yJS
function crearTarjeta(cancha) {

    let categoriaCompleta = cancha.deporte;
    if (cancha.deporte === "Fútbol" && cancha.subcategoria) {
        categoriaCompleta += ` - ${cancha.subcategoria}`;
    }
    return `
        <div class="letter-card">
            <div class="card-inner">

                <div class="card-front">
                    <div class="card-foto-caja">
                        <img src="${cancha.imagen}" alt="Cancha de ${cancha.deporte}" class="card-foto">
                        <span class="etiqueta">${categoriaCompleta}</span>
                    </div>
                    <div class="card-datos">
                        <h2 class="card-nombre">${cancha.nombre}</h2>
                        <p class="card-pais">${cancha.pais}</p>
                        <p class="card-ciudad">${cancha.ciudad}</p>
                        <p class="card-precio">${cancha.precio}</p>
                        <button class="boton btn-reservar" data-id="${cancha.id}">Reservar</button>
                    </div>
                </div>

                <div class="card-back">
                    <img src="${cancha.balon}" alt="Balón de ${cancha.deporte}" class="img-balon">
                    <h3>${cancha.nombre}</h3>
                    <p class="detalle">${cancha.detalle}</p>
                    <p>${cancha.precio}</p>
                    <button class="boton boton-naranja btn-reservar" data-id="${cancha.id}">Reservar ahora</button>
                </div>

            </div>
        </div>
    `;
}

// Funcion para mostrar tarjetas por pagina (revisar si se puede mostrar el icono del numero de pestaña a elegir)
function mostrarCanchas() {
    const lista = filtrarCanchas();
    const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));

    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    const inicio = (paginaActual - 1) * POR_PAGINA;
    const canchasDeLaPagina = lista.slice(inicio, inicio + POR_PAGINA);

    galeria.classList.remove("hay-seleccion");

    if (canchasDeLaPagina.length === 0) {
        galeria.innerHTML = '<p class="sin-resultados">No hay canchas con esos filtros. Prueba quitando alguno.</p>';
    } else {
        galeria.innerHTML = canchasDeLaPagina.map(crearTarjeta).join("");
    }

    textoResultado.textContent = `${lista.length} canchas encontradas`;
    paginaInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
}

//Se investiga versatilidad de tarjetas y eventos al aplicar click

// Al cambiar un filtro volvemos a la página 1
filtroDeporte.addEventListener("change", () => { actualizarFiltroSubcategorias(); paginaActual = 1; mostrarCanchas(); });
filtroSubcategoria.addEventListener("change", () => { paginaActual = 1; mostrarCanchas(); });
filtroPais.addEventListener("change", () => { paginaActual = 1; mostrarCanchas(); });

btnLimpiar.addEventListener("click", () => {
    document.getElementById("filtros").reset();
    actualizarFiltroSubcategorias();
    paginaActual = 1;
    mostrarCanchas();
});

btnAnterior.addEventListener("click", () => { if (paginaActual > 1) { paginaActual--; mostrarCanchas(); }});
btnSiguiente.addEventListener("click", () => { paginaActual++; mostrarCanchas(); });

// Se selecciona (sobresale y gira) pero si se da otro clic la deselecciona.
// Revisar que no tarde en cargar sino volver a renderizar o cambiar de logica
galeria.addEventListener("click", (evento) => {
    const botonReservar = evento.target.closest(".btn-reservar");
    if (botonReservar) {
        const idCancha = encodeURIComponent(botonReservar.dataset.id);
            // Aqui se redirecciona a la page reservas
            window.location.href = `reservas.html?cancha=${idCancha}`;
        return;
    }

    const tarjeta = evento.target.closest(".letter-card");
    if (!tarjeta) return;

    const yaEstabaSeleccionada = tarjeta.classList.contains("seleccionada");

    // Aqui querySelectorAll nos permite quitar la selección de todas
    galeria.querySelectorAll(".letter-card").forEach(t => t.classList.remove("seleccionada", "flipped"));
    galeria.classList.remove("hay-seleccion");

    // Y seleccionamos la que sea para mirar (todavia el if es complejo)
    if (!yaEstabaSeleccionada) {
        tarjeta.classList.add("seleccionada", "flipped");
        galeria.classList.add("hay-seleccion");
    }
});

window.addEventListener("storage", (evento) => {

    if (evento.key === "canchasMiCancha") {
        paginaActual = 1;
        cargarFiltroDeportes();
        actualizarFiltroSubcategorias();
        mostrarCanchas();
    }

});

cargarFiltroDeportes();
actualizarFiltroSubcategorias();
mostrarCanchas();