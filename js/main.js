import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { iniciarNavbar } from './ui/navbar-comportamiento.js';
import { iniciarMenuUsuario } from './ui/menu-usuario.js';

// Cerrar menú móvil al tocar fuera de la tarjeta flotante movil
document.addEventListener('click', (evento) => {
    const menu = document.getElementById('navMenu');
    const toggle = document.getElementById('menuToggle');
    if (!menu || !toggle) return;

    const clicFuera = !menu.contains(evento.target) && !toggle.contains(evento.target);

    if (menu.classList.contains('activo') && clicFuera) {
        menu.classList.remove('activo');
        toggle.classList.remove('activo');
    }
    });

renderNavbar();
renderFooter();
iniciarNavbar();
iniciarMenuUsuario();