// se reemplaza con el url de la imagen
// aqui f_auto elige el mejor formato, q_auto ajusta la calidad
// y w_ reduce el ancho al tamaño que realmente se ve en pantalla.
const CLOUDINARY = "https://res.cloudinary.com/hg1j7l69/image/upload";
const ANCHO_FOTO = 600;   // foto de la tarjeta
const ANCHO_BALON = 300;  // imagen del reverso

function img(id, ancho) {
    return `${CLOUDINARY}/f_auto,q_auto,w_${ancho}/${id}`;
}

/* SERVICIO DE CANCHAS: fuente única de canchas para el catálogo, el panel y las reservas */
const CLAVE_ADMIN = "canchasMiCancha";

/* Canchas base del catálogo */
export const CANCHAS_BASE = [
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
    const [ciudadTexto, paisTexto] = c.ciudad.split(",").map((s) => s.trim());
    const pais = c.pais ?? paisTexto;
    const ciudad = corregirCiudad(ciudadTexto);
    return {
        id: crearId(c.nombre, ciudad),
        nombre: c.nombre.trim(),
        pais,
        ciudad,
        sede: `${ciudad}, ${pais}`,
        categoria: c.deporte,
        subcategoria: c.subcategoria ?? "",
        ...leerPrecio(c.precio),
        imagen: c.imagen,
        balon: c.balon,
        detalle: c.detalle ?? `Cancha deportiva para practicar ${c.deporte} en ${ciudad}`,
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
        subcategoria: c.subcategoria ?? "",
        moneda: c.moneda,
        valor: Number(c.valor),
        imagen: c.imagen,
        balon: c.balon,
        detalle: c.detalle && c.detalle !== "undefined" ? c.detalle : `Cancha deportiva ubicada en ${c.ciudad}`,
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