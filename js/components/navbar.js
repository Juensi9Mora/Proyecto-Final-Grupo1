import { ruta, paginaActual } from '../config/rutas.js';
import { menuPrincipal } from '../data/navegacion.js';

export function renderNavbar(selector = '#navbar-root') {
  const placeholder = document.querySelector(selector);
  if (!placeholder) return;

  const actual = paginaActual();

  const items = menuPrincipal
    .map(({ id, texto, href }) => `
      <li><a href="${ruta(href)}" class="${id === actual ? 'activo' : ''}">${texto}</a></li>`)
    .join('');

  placeholder.outerHTML = `
    <header class="navbar" id="mainNavbar">
      <a href="${ruta('index.html')}" class="logo" aria-label="Mi Cancha Inicio">
        <img src="${ruta('img/mi_cancha_prototipo_logo.png')}" alt="Logo Mi Cancha" class="logo-marca">
        <span class="logo-text">Mi Cancha</span>
      </a>

      <button class="menu-toggle" id="menuToggle" aria-label="Abrir menú de navegación">
        <span></span><span></span><span></span>
      </button>

      <nav aria-label="Principal">
        <ul class="menu" id="navMenu">${items}</ul>
      </nav>

      <div class="nav-actions">
        <a href="#" class="login" aria-label="Iniciar sesión">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </a>
      </div>
    </header>`;
}