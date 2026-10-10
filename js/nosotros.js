document.addEventListener("DOMContentLoaded", () => {
    const mainNavbar = document.getElementById("mainNavbar");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    
    const scrollThreshold = 40;
    let isScrolled = false;

    // 1. Efecto de cambio de navbar al hacer scroll optimizado
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > scrollThreshold && !isScrolled) {
            mainNavbar.classList.add("scrolled");
            isScrolled = true;
        } else if (currentScroll <= scrollThreshold && isScrolled) {
            mainNavbar.classList.remove("scrolled");
            isScrolled = false;
        }
    }, { passive: true });

    // 2. Funcionalidad del Menú Hamburguesa para Móviles
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("activo");
            navMenu.classList.toggle("activo");
        });

        // Cerrar el menú automáticamente al hacer clic en cualquier enlace de navegación móvil
        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("activo");
                navMenu.classList.remove("activo");
            });
        });
    }
});