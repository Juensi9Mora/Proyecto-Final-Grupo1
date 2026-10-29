// Crear listas por cancha
const canchas = [
    // Baloncesto Colombia
    { nombre: "Cancha El Paraiso", ciudad: "Medellín, Colombia", precio: "COP 60.000 / hora", imagen: "../img/Cancha-Baloncesto.webp", balon: "../img/aro.webp", deporte: "Baloncesto" },
    // Futbol Colombia
    { nombre: "Cancha Marbella", ciudad: "Bogotá, Colombia", precio: "COP 90.000 / hora", imagen: "../img/Cancha-Futbol.webp", balon: "../img/Balon-Futbol.webp", deporte: "Fútbol" },
    // Volleyball Colombia
    { nombre: "Cancha El Remate", ciudad: "Medellin, Colombia", precio: "COP 70.000 / hora", imagen: "../img/Cancha-Volley.webp", balon: "../img/Balon-Volley.webp", deporte: "Volleyball" },
    // Tenis Colombia
    { nombre: "Cancha El Salitre", ciudad: "Bogota, Colombia", precio: "COP 150.000 / hora", imagen: "../img/Cancha-Tenis.webp", balon: "../img/pelota-tenis.webp", deporte: "Tennis" },
    // Futsal Colombia
    { nombre: "Cancha Arena 7", ciudad: "Bogota, Colombia", precio: "COP 80.000 / hora", imagen: "../img/futsal.webp", balon: "../img/Futsal-1.webp", deporte: "Futsal" },
    // NFL Colombia
    { nombre: "Cancha SanCristobal", ciudad: "Medellin, Colombia", precio: "COP 180.000 / hora", imagen: "../img/Cancha-Americano.webp", balon: "../img/Balon-Americano.webp", deporte: "Futbol Americano" },
    // MLB Colombia
    { nombre: "Cancha Jardines", ciudad: "Bogota, Colombia", precio: "COP 180.000 / hora", imagen: "../img/Cancha-Beisbol.webp", balon: "../img/Pelota-Beisbol.webp", deporte: "Beisbol" },
    // Volleyball Peru
    { nombre: "Coliseo Arequipa", ciudad: "Arequipa, Perú", precio: "PEN 80.00 / hora", imagen: "../img/Volley.webp", balon: "../img/VolleyB.webp", deporte: "Voley" },
    // Baloncesto Peru
    { nombre: "Cancha Elbows", ciudad: "Lima, Perú", precio: "PEN 180.000 / hora", imagen: "../img/Baloncesto.webp", balon: "../img/Balon-Baloncesto.webp", deporte: "Baloncesto" },
    // Futbol Peru
    { nombre: "Cancha DeporGol", ciudad: "Arequipa, Perú", precio: "PEN 90.00 / hora", imagen: "../img/Futbol.webp", balon: "../img/Balon-2.webp", deporte: "Fútbol" },
    // Balonmano Peru
    { nombre: "Cancha Campo de Marte", ciudad: "Lima, Perú", precio: "PEN 100.00 / hora", imagen: "../img/Cancha-Balon-mano.webp", balon: "../img/Balon-Mano.webp", deporte: "Balón mano" },
    // Tenis Perú
    { nombre: "Cancha TenniSport", ciudad: "Lima, Perú", precio: "PEN 200.00 / hora", imagen: "../img/Tenis.webp", balon: "../img/TenisP.webp", deporte: "Tennis" },
    // MLB Perú
    { nombre: "Cancha RedDiamond ", ciudad: "Arequipa, Perú", precio: "PEN 180.00 / hora", imagen: "../img/Beisbol.webp", balon: "../img/BeisbolC.webp", deporte: "Beisbol" },
    // NFL Peru
    { nombre: "El Centinela", ciudad: "Lima, Perú", precio: "PEN 190.00 / hora", imagen: "../img/NFL.webp", balon: "../img/NFLC.webp", deporte: "Futbol Americano" },

];

// Se visualizo 4 tarjetas por página (2 x 2, como en el boceto de figma)
// pero el resultado final no queda bien revisar que cubra 3 por linea o revisar desde otro dispositivo
// la vista desde el celular se sigue viendo muy grande :/
const POR_PAGINA = 4;
let paginaActual = 1;

// Para los filtros y funcion de pasar de pagina se ejecuta con get desde elementos del HTML
const galeria = document.getElementById("galeria-canchas");
const textoResultado = document.getElementById("resultado-texto");
const paginaInfo = document.getElementById("pagina-info");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");
const btnLimpiar = document.getElementById("btn-limpiar");
const filtroDeporte = document.getElementById("filtro-deporte");
const filtroPais = document.getElementById("filtro-pais");

// para filtrar se investiga como dejar solo las canchas que cumplen los filtros elegidos
function filtrarCanchas() {
    const deporte = filtroDeporte.value;
    const pais = filtroPais.value;

    return canchas.filter(cancha =>
        (deporte === "" || cancha.deporte === deporte) &&
        (pais === "" || cancha.pais === pais)
    );
}

// Se crea cada tarjeta con HTML yJS
function crearTarjeta(cancha) {
    return `
        <div class="letter-card">
            <div class="card-inner">

                <div class="card-front">
                    <div class="card-foto-caja">
                        <img src="${cancha.imagen}" alt="Cancha de ${cancha.deporte}" class="card-foto">
                        <span class="etiqueta">${cancha.deporte}</span>
                    </div>
                    <div class="card-datos">
                        <h2 class="card-nombre">${cancha.nombre}</h2>
                        <p class="card-ciudad">${cancha.ciudad}, ${cancha.pais}</p>
                        <p class="card-precio">${cancha.precio}</p>
                        <button class="boton btn-reservar" data-nombre="${cancha.nombre}">Reservar</button>
                    </div>
                </div>

                <div class="card-back">
                    <img src="${cancha.balon}" alt="Balón de ${cancha.deporte}" class="img-balon">
                    <h3>${cancha.nombre}</h3>
                    <p class="detalle">${cancha.detalle}</p>
                    <p>${cancha.precio}</p>
                    <button class="boton boton-naranja btn-reservar" data-nombre="${cancha.nombre}">Reservar ahora</button>
                </div>

            </div>
        </div>
    `;
}

// Funcion para mostrar tarjetas por pagina (revisar si se puede mostrar el icono del numero de pestaña a elegir)
function mostrarCanchas() {
    const lista = filtrarCanchas();
    const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));

    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    const inicio = (paginaActual - 1) * POR_PAGINA;
    const canchasDeLaPagina = lista.slice(inicio, inicio + POR_PAGINA);

    galeria.classList.remove("hay-seleccion");

    if (canchasDeLaPagina.length === 0) {
        galeria.innerHTML = '<p class="sin-resultados">No hay canchas con esos filtros. Prueba quitando alguno.</p>';
    } else {
        galeria.innerHTML = canchasDeLaPagina.map(crearTarjeta).join("");
    }

    textoResultado.textContent = `${lista.length} canchas encontradas`;
    paginaInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
}

//Se investiga versatilidad de tarjetas y eventos al aplicar click

// Al cambiar un filtro volvemos a la página 1
filtroDeporte.addEventListener("change", () => { paginaActual = 1; mostrarCanchas(); });
filtroPais.addEventListener("change", () => { paginaActual = 1; mostrarCanchas(); });

btnLimpiar.addEventListener("click", () => {
    document.getElementById("filtros").reset();
    paginaActual = 1;
    mostrarCanchas();
});

btnAnterior.addEventListener("click", () => { paginaActual--; mostrarCanchas(); });
btnSiguiente.addEventListener("click", () => { paginaActual++; mostrarCanchas(); });

// Se selecciona (sobresale y gira) pero si se da otro clic la deselecciona.
// Revisar que no tarde en cargar sino volver a renderizar o cambiar de logica
galeria.addEventListener("click", (evento) => {
    const botonReservar = evento.target.closest(".btn-reservar");
    if (botonReservar) {
        // Se busca la cancha por su nombre y se guarda en el carrito (carrito-datos.js)
        const cancha = canchas.find(c => c.nombre === botonReservar.dataset.nombre);
        if (cancha) agregarAlCarrito(cancha);
        return;
    }

    const tarjeta = evento.target.closest(".letter-card");
    if (!tarjeta) return;

    const yaEstabaSeleccionada = tarjeta.classList.contains("seleccionada");

    // Aqui querySelectorAll nos permite quitar la selección de todas
    galeria.querySelectorAll(".letter-card").forEach(t => t.classList.remove("seleccionada", "flipped"));
    galeria.classList.remove("hay-seleccion");

    // Y seleccionamos la que sea para mirar (todavia el if es complejo)
    if (!yaEstabaSeleccionada) {
        tarjeta.classList.add("seleccionada", "flipped");
        galeria.classList.add("hay-seleccion");
    }
});

mostrarCanchas();