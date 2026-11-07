/* SERVICIO DE CANCHAS: fuente única de canchas para el catálogo y las reservas */
const CLAVE_ADMIN = "canchasMiCancha";

/* Canchas base del catálogo (movidas aquí desde catalogo-canchas.js, sin cambios) */
export const CANCHAS_BASE = [
    // Baloncesto Colombia
    { nombre: "Cancha El Paraiso", ciudad: "Medellín", pais: "Colombia", precio: "COP 60.000 / hora", imagen: "../img/Cancha-Baloncesto.webp", balon: "../img/aro.webp", deporte: "Baloncesto" },
    // Futbol Colombia
    { nombre: "Cancha Marbella", ciudad: "Bogotá", pais: "Colombia", precio: "COP 90.000 / hora", imagen: "../img/Cancha-Futbol.webp", balon: "../img/Balon-Futbol.webp", deporte: "Fútbol" },
    // Volleyball Colombia
    { nombre: "Cancha El Remate", ciudad: "Medellin", pasi: "Colombia", precio: "COP 70.000 / hora", imagen: "../img/Cancha-Volley.webp", balon: "../img/Balon-Volley.webp", deporte: "Volleyball" },
    // Tenis Colombia
    { nombre: "Cancha El Salitre", ciudad: "Bogotá", pais: "Colombia", precio: "COP 150.000 / hora", imagen: "../img/Cancha-Tenis.webp", balon: "../img/pelota-tenis.webp", deporte: "Tennis" },
    // Futsal Colombia
    { nombre: "Cancha Arena 7", ciudad: "Bogotá", pais: "Colombia", precio: "COP 80.000 / hora", imagen: "../img/futsal.webp", balon: "../img/Futsal-1.webp", deporte: "Futsal" },
    // NFL Colombia
    { nombre: "Cancha SanCristobal", ciudad: "Medellin", pais: "Colombia", precio: "COP 180.000 / hora", imagen: "../img/Cancha-Americano.webp", balon: "../img/Balon-Americano.webp", deporte: "Futbol Americano" },
    // MLB Colombia
    { nombre: "Cancha Jardines", ciudad: "Bogotá", pais: "Colombia", precio: "COP 180.000 / hora", imagen: "../img/Cancha-Beisbol.webp", balon: "../img/Pelota-Beisbol.webp", deporte: "Beisbol" },
    // Volleyball Peru
    { nombre: "Coliseo Arequipa", ciudad: "Arequipa", pais: "Perú", precio: "PEN 80.00 / hora", imagen: "../img/Cancha-Volley.webp", balon: "../img/VolleyB.webp", deporte: "Voley" },
    // Baloncesto Peru
    { nombre: "Cancha Elbows", ciudad: "Lima", pais: "Perú", precio: "PEN 180.000 / hora", imagen: "../img/Baloncesto.webp", balon: "../img/Balon-Baloncesto.webp", deporte: "Baloncesto" },
    // Futbol Peru
    { nombre: "Cancha DeporGol", ciudad: "Arequipa", pais: "Perú", precio: "PEN 90.00 / hora", imagen: "../img/Futbol.webp", balon: "../img/Balon-2.webp", deporte: "Fútbol" },
    // Balonmano Peru
    { nombre: "Cancha Campo de Marte", ciudad: "Lima", pais: "Perú", precio: "PEN 100.00 / hora", imagen: "../img/Cancha-Balon-mano.webp", balon: "../img/Balon-Mano.webp", deporte: "Balón mano" },
    // Tenis Perú
    { nombre: "Cancha TenniSport", ciudad: "Lima", pais: "Perú", precio: "PEN 200.00 / hora", imagen: "../img/Tenis.webp", balon: "../img/TenisP.webp", deporte: "Tennis" },
    // MLB Perú
    { nombre: "Cancha RedDiamond ", ciudad: "Arequipa", pais: "Perú", precio: "PEN 180.00 / hora", imagen: "../img/Beisbol.webp", balon: "../img/BeisbolC.webp", deporte: "Beisbol" },
    // NFL Peru
    { nombre: "El Centinela", ciudad: "Lima", pais: "Perú", precio: "PEN 190.00 / hora", imagen: "../img/NFL.webp", balon: "../img/NFLC.webp", deporte: "Futbol Americano" },

];

/* Quita tildes y mayúsculas: "Medellín" y "Medellin" cuentan como la misma ciudad */
const normalizar = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim().replace(/\s+/g, " ");

export const crearId = (nombre, ciudad) => `${normalizar(nombre)}|${normalizar(ciudad)}`;

const corregirCiudad = (ciudad) =>
    ({ bogota: "Bogotá", medellin: "Medellín" }[normalizar(ciudad)] ?? ciudad.trim());

/* "COP 60.000 / hora" -> { moneda: "COP", valor: 60000 }; "PEN 80.00 / hora" -> 80 */
function leerPrecio(texto) {
    const [moneda, numero] = texto.split(" ");
    const limpio = /\.\d{3}$/.test(numero) ? numero.replace(".", "") : numero;
    return { moneda, valor: Number(limpio) };
}

function desdeBase(c) {
    const [ciudadTexto, pais] = c.ciudad.split(",").map((s) => s.trim());
    const ciudad = corregirCiudad(ciudadTexto);
    return {
        id: crearId(c.nombre, ciudad),
        nombre: c.nombre.trim(),
        pais,
        ciudad,
        sede: `${ciudad}, ${pais}`,
        categoria: c.deporte,
        ...leerPrecio(c.precio),
        imagen: c.imagen,
        balon: c.balon,
        detalle: c.detalle || `Cancha deportiva para practicar ${c.deporte} en ${c.ciudad}`,
        origen: "base"
    };
}

function desdeAdmin(c) {
    const pais = c.pais === "Peru" ? "Perú" : c.pais;
    return {
        id: crearId(c.nombre, c.ciudad),
        nombre: c.nombre.trim(),
        pais,
        ciudad: c.ciudad,
        sede: `${c.ciudad}, ${pais}`,
        categoria: c.categoria,
        moneda: c.moneda,
        valor: Number(c.valor),
        imagen: c.imagen,
        origen: "admin"
    };
}

function leerAdmin() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_ADMIN)) || [];
    } catch {
        return [];
    }
}

/* Todas las canchas reservables: las activas del panel + las base del catálogo */
export function obtenerCanchas() {
    const admin = leerAdmin().filter((c) => c.activa).map(desdeAdmin);
    return [...admin, ...CANCHAS_BASE.map(desdeBase)];
}
