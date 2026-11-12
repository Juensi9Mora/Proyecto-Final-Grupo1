const carrusel = document.querySelector('.carrusel');

if (carrusel) {
    const slides = [...carrusel.querySelectorAll('.slide')];
    const contenedorPuntos = carrusel.querySelector('.carrusel-puntos');
    const btnAnterior = carrusel.querySelector('.carrusel-anterior');
    const btnSiguiente = carrusel.querySelector('.carrusel-siguiente');
    const btnPausa = carrusel.querySelector('.carrusel-pausa');

    const INTERVALO = 6000; // milisegundos entre una cancha y otra
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

    let actual = 0;
    let temporizador = null;
    let pausadoPorUsuario = false;

    // ----- Puntos: se crean según la cantidad de slides -----
    const puntos = slides.map((slide, i) => {
        const punto = document.createElement('button');
        punto.type = 'button';
        punto.className = 'carrusel-punto';
        punto.setAttribute('aria-label', `Ir a la cancha ${i + 1}`);
        punto.addEventListener('click', () => {
            irA(i);
            reiniciar();
        });
        contenedorPuntos.appendChild(punto);
        return punto;
    });

    // ----- Carga diferida: las imágenes con data-src se descargan después -----
    function cargarImagen(slide) {
        const img = slide.querySelector('img');
        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            delete img.dataset.srcset;
        }
        if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
        }
    }

    // ----- Mostrar una slide -----
    function irA(indice) {
        actual = (indice + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const activa = i === actual;
            if (activa) cargarImagen(slide);
            slide.classList.toggle('activa', activa);
            slide.setAttribute('aria-hidden', String(!activa));
            slide.inert = !activa; // los enlaces de slides ocultas no reciben foco
            puntos[i].classList.toggle('activo', activa);
            puntos[i].setAttribute('aria-current', String(activa));
        });

        // Deja lista la siguiente para que aparezca sin esperar
        cargarImagen(slides[(actual + 1) % slides.length]);
    }

    // ----- Cambio automático -----
    function detener() {
        clearInterval(temporizador);
        temporizador = null;
    }

    function iniciar() {
        if (sinMovimiento.matches || pausadoPorUsuario || temporizador) return;
        temporizador = setInterval(() => {
            if (!document.hidden) irA(actual + 1);
        }, INTERVALO);
    }

    function reiniciar() {
        detener();
        iniciar();
    }

    // ----- Botones -----
    btnSiguiente.addEventListener('click', () => {
        irA(actual + 1);
        reiniciar();
    });

    btnAnterior.addEventListener('click', () => {
        irA(actual - 1);
        reiniciar();
    });

    // Con el mouse encima o con el foco dentro, se pausa para poder leer
    carrusel.addEventListener('mouseenter', detener);
    carrusel.addEventListener('mouseleave', iniciar);
    carrusel.addEventListener('focusin', detener);
    carrusel.addEventListener('focusout', iniciar);

    // Flechas del teclado cuando el foco está dentro del carrusel
    carrusel.addEventListener('keydown', (evento) => {
        if (evento.key === 'ArrowRight') {
            irA(actual + 1);
            reiniciar();
        } else if (evento.key === 'ArrowLeft') {
            irA(actual - 1);
            reiniciar();
        }
    });

    // Si prefiere menos movimiento no hay cambio automático ni botón de pausa
    if (sinMovimiento.matches) btnPausa.hidden = true;

    // Cuando termina de cargar la página, se descargan las imágenes que faltan
    window.addEventListener('load', () => slides.forEach(cargarImagen));

    irA(0);
    iniciar();
}