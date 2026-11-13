/* SERVICIO DE SESIÓN: quién inició sesión en este navegador.
   Lee la clave "usuarioActivo" (la misma que usa tu navbar) y acepta cualquiera de estos formatos:
   - un objeto JSON:  { "nombre": "Ana", "correo": "ana@correo.com" }
   - un texto simple: "ana@correo.com"
   Siempre devuelve { nombre, correo } o null si no hay sesión. */
const CLAVE_SESION = "usuarioActivo";

function normalizar(crudo) {
    if (!crudo) return null;

    let datos;
    try {
        datos = JSON.parse(crudo);
    } catch {
        datos = crudo;   // no era JSON: es texto simple
    }

    if (datos && typeof datos === "object") {
        const correo = datos.correo || datos.email || "";
        return { nombre: datos.nombre || datos.name || correo || "Usuario", correo };
    }

    const texto = String(datos).trim();
    if (!texto || texto === "false" || texto === "null") return null;
    if (texto === "true") return { nombre: "Usuario", correo: "" };
    return { nombre: texto, correo: texto.includes("@") ? texto : "" };
}

export const obtenerSesion = () => normalizar(localStorage.getItem(CLAVE_SESION));

export const cerrarSesion = () => localStorage.removeItem(CLAVE_SESION);
