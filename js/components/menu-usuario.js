import { ruta } from '../config/rutas.js';
import { obtenerSesion } from '../services/sesionService.js';

/* Iconos con el mismo trazo que el icono de usuario del navbar */
const ICONOS = {
  usuario: '<circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />',
  entrar: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" />',
  crear: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" />',
  reservar: '<rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />',
  salir: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />',
};

const svg = (nombre) => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre]}</svg>`;

const esc = (t) => String(t).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const enlace = (texto, icono, href, clase = '') =>
  `<li><a class="menu-usuario-item ${clase}" href="${ruta(href)}" role="menuitem">${svg(icono)}${texto}</a></li>`;

/* Contenido del desplegable: cambia según haya sesión o no */
function contenidoMenu(sesion) {
  if (!sesion) {
    return `
      <div class="menu-usuario-cabecera">
        <span class="menu-usuario-avatar">${svg('usuario')}</span>
        <div class="menu-usuario-datos">
          <strong>Hola, invitado</strong>
          <span>Ingresa para reservar tus canchas</span>
        </div>
      </div>
      <ul class="menu-usuario-lista">
        ${enlace('Iniciar sesión', 'entrar', 'pages/inicio_sesion.html', 'principal')}
        ${enlace('Crear cuenta', 'crear', 'pages/registro.html')}
      </ul>`;
  }

  return `
    <div class="menu-usuario-cabecera">
      <span class="menu-usuario-avatar">${esc(sesion.nombre.trim().charAt(0).toUpperCase())}</span>
      <div class="menu-usuario-datos">
        <strong>${esc(sesion.nombre)}</strong>
        <span>${esc(sesion.correo || 'Sesión iniciada')}</span>
      </div>
    </div>
    <ul class="menu-usuario-lista">
      ${enlace('Mi perfil', 'usuario', 'pages/perfil.html')}
      ${enlace('Reservar cancha', 'reservar', 'pages/reservas.html')}
    </ul>
    <div class="menu-usuario-separador"></div>
    <ul class="menu-usuario-lista">
      <li>
        <button type="button" class="menu-usuario-item peligro" role="menuitem" data-accion="cerrar-sesion">
          ${svg('salir')}Cerrar sesión
        </button>
      </li>
    </ul>`;
}

/* Devuelve el bloque completo <div class="nav-actions"> para el navbar */
export function renderMenuUsuario() {
  const sesion = obtenerSesion();
  const textoAria = sesion ? `Menú de ${sesion.nombre}` : 'Menú de usuario';

  return `
    <div class="nav-actions">
      <button type="button" class="login ${sesion ? 'con-sesion' : ''}" id="btnUsuario"
              aria-haspopup="menu" aria-expanded="false" aria-controls="menuUsuario" aria-label="${esc(textoAria)}">
        ${svg('usuario')}
      </button>
      <div class="menu-usuario" id="menuUsuario" role="menu" aria-labelledby="btnUsuario">
        <div class="menu-usuario-panel">
          ${contenidoMenu(sesion)}
        </div>
      </div>
    </div>`;
}
