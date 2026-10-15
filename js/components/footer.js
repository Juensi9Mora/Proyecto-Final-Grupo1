import { ruta } from '../config/rutas.js';
import { footerColumnas, contacto } from '../data/navegacion.js';

export function renderFooter(selector = '#footer-root') {
  const placeholder = document.querySelector(selector);
  if (!placeholder) return;

  const columnas = footerColumnas.map(({ titulo, links }) => `
    <div class="footer-column">
      <h2>${titulo}</h2>
      <ul>
        ${links.map(({ texto, href, interno }) =>
          `<li><a href="${interno ? ruta(href) : href}">${texto}</a></li>`).join('')}
      </ul>
    </div>`).join('');

  const telefonos = contacto.telefonos
    .map(({ texto, href }) => `<a href="${href}">${texto}</a>`).join('');

  placeholder.outerHTML = `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-brand">
          <a href="${ruta('index.html')}" class="footer-logo" aria-label="Mi Cancha - Inicio">
            <img src="${ruta('img/mi_cancha_prototipo_logo.png')}" alt="Logo de Mi Cancha">
          </a>
          <p class="footer-description">Tu próximo partido comienza aquí.</p>
        </div>

        <div class="footer-column">
          <h2>Contacto</h2>
          <address>
            <span>${contacto.ubicacion}</span>
            ${telefonos}
            <a href="mailto:${contacto.correo}">${contacto.correo}</a>
          </address>
        </div>

        ${columnas}
      </div>

      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Mi Cancha. Todos los derechos reservados.</p>
      </div>
    </footer>`;
}