export function iniciarNavbar() {
  const navbar = document.getElementById('mainNavbar');
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('navMenu');
  if (!navbar || !toggle || !menu) return;

  const alternarScroll = () =>
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  alternarScroll();
  window.addEventListener('scroll', alternarScroll, { passive: true });

  toggle.addEventListener('click', () => {
    const abierto = menu.classList.toggle('activo');
    toggle.classList.toggle('activo', abierto);
    toggle.setAttribute('aria-expanded', abierto);
  });

  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('activo');
      toggle.classList.remove('activo');
    })
  );
}