import { cerrarSesion } from '../services/sesionService.js';
import { ruta } from '../config/rutas.js';

/* Abre y cierra el desplegable del usuario. Se llama después de renderNavbar(). */
export function iniciarMenuUsuario() {
  const boton = document.getElementById('btnUsuario');
  const menu = document.getElementById('menuUsuario');
  if (!boton || !menu) return;

  const estaAbierto = () => menu.classList.contains('abierto');

  const alternar = (abrir) => {
    menu.classList.toggle('abierto', abrir);
    boton.setAttribute('aria-expanded', abrir);

    // en celular, si se abre este menú se cierra el menú hamburguesa
    if (abrir) {
      document.getElementById('navMenu')?.classList.remove('activo');
      document.getElementById('menuToggle')?.classList.remove('activo');
    }
  };

  boton.addEventListener('click', () => alternar(!estaAbierto()));

  // clic fuera del menú: se cierra
  document.addEventListener('click', (e) => {
    if (estaAbierto() && !menu.contains(e.target) && !boton.contains(e.target)) alternar(false);
  });

  // tecla Esc: se cierra y el foco vuelve al botón
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && estaAbierto()) {
      alternar(false);
      boton.focus();
    }
  });

  // al abrir el menú hamburguesa, se cierra este
  document.getElementById('menuToggle')?.addEventListener('click', () => alternar(false));

  menu.addEventListener('click', (e) => {
    if (e.target.closest('[data-accion="cerrar-sesion"]')) {
      cerrarSesion();
      window.location.href = ruta('index.html');
    }
  });
}
