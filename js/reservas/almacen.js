/* ALMACÉN: claves de localStorage y funciones de apoyo */
export const CLAVES = {
    reserva: "reservaActual",          // horarios que el usuario está armando
    confirmadas: "reservasConfirmadas",// reservas ya confirmadas (marcan horas ocupadas)
};

function leer(clave, porDefecto) {
    try {
        return JSON.parse(localStorage.getItem(clave)) ?? porDefecto;
    } catch {
        return porDefecto;
    }
}

function guardar(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
        /* almacenamiento lleno o bloqueado: la app sigue funcionando en memoria */
    }
}

export const leerReserva = () => leer(CLAVES.reserva, []);
export const guardarReserva = (items) => guardar(CLAVES.reserva, items);
export const leerConfirmadas = () => leer(CLAVES.confirmadas, []);
export const guardarConfirmadas = (lista) => guardar(CLAVES.confirmadas, lista);
/* La sesión la maneja el servicio (clave "usuarioActivo") */
export { obtenerSesion as leerUsuario } from "../services/sesionService.js";

/* Evita que un nombre con símbolos rompa el HTML */
export const esc = (texto) => String(texto).replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

export const dinero = (moneda, valor) => `${moneda} ${Number(valor).toLocaleString("es-CO")}`;

export const hora12 = (h) => `${h % 12 || 12}:00 ${h >= 12 ? "p.m." : "a.m."}`;

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
    "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

export const nombreDia = (d) => DIAS[d.getDay()];
export const nombreMes = (d) => MESES[d.getMonth()];

export function fechaISO(d) {
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mes}-${dia}`;
}

export function fechaLarga(iso) {
    const d = new Date(`${iso}T00:00:00`);
    return `${nombreDia(d)} ${d.getDate()} de ${nombreMes(d)}`;
}