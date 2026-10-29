// Vista del carrito de reservas (usa las funciones de carrito-datos.js)

const listaCarrito = document.getElementById("lista-carrito");
const resumenTotales = document.getElementById("resumen-totales");
const resumenHoras = document.getElementById("resumen-horas");
const btnVaciar = document.getElementById("btn-vaciar");

// Se crea cada fila del carrito con HTML y JS
function crearItem(item, indice) {
    const subtotal = item.valor * item.horas;
    return `
        <article class="carrito-item" data-nombre="${item.nombre}">
            <img src="${item.imagen}" alt="Cancha de ${item.deporte}" class="carrito-foto">

            <div class="carrito-info">
                <span class="etiqueta-deporte">${item.deporte}</span>
                <h3>${item.nombre}</h3>
                <p class="carrito-ciudad">${item.ciudad}</p>
                <p class="carrito-tarifa">${formatearPrecio(item.valor, item.moneda)} / hora</p>
            </div>

            <div class="carrito-cantidad">
                <label for="horas-${indice}">Horas</label>
                <div class="control-cantidad">
                    <button type="button" class="btn-cantidad btn-restar" aria-label="Quitar una hora">−</button>
                    <input type="number" id="horas-${indice}" class="input-horas"
                           min="1" max="${HORAS_MAXIMAS}" step="1" value="${item.horas}">
                    <button type="button" class="btn-cantidad btn-sumar" aria-label="Agregar una hora">+</button>
                </div>
            </div>

            <div class="carrito-subtotal">
                <span>Subtotal</span>
                <strong>${formatearPrecio(subtotal, item.moneda)}</strong>
                <button type="button" class="btn-eliminar">Eliminar</button>
            </div>
        </article>
    `;
}

// Los totales se calculan por moneda porque no se pueden sumar COP con PEN
function calcularTotales(carrito) {
    const totales = {};
    carrito.forEach(item => {
        totales[item.moneda] = (totales[item.moneda] || 0) + item.valor * item.horas;
    });
    return totales;
}

function mostrarCarrito() {
    const carrito = leerCarrito();

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <div class="carrito-vacio">
                <p>Todavía no tienes canchas reservadas.</p>
                <a href="catalogo-canchas.html" class="boton boton-naranja">Explorar canchas</a>
            </div>`;
        resumenTotales.innerHTML = "<p>—</p>";
        resumenHoras.textContent = "0";
        btnVaciar.disabled = true;
        return;
    }

    listaCarrito.innerHTML = carrito.map(crearItem).join("");

    const totales = calcularTotales(carrito);
    resumenTotales.innerHTML = Object.entries(totales)
        .map(([moneda, total]) => `<p class="total-linea"><span>Total ${moneda}</span><strong>${formatearPrecio(total, moneda)}</strong></p>`)
        .join("");

    resumenHoras.textContent = carrito.reduce((suma, item) => suma + item.horas, 0);
    btnVaciar.disabled = false;
}

// Valida y guarda la nueva cantidad de horas de una cancha
function cambiarHoras(nombre, nuevasHoras) {
    const carrito = leerCarrito();
    const item = carrito.find(i => i.nombre === nombre);
    if (!item) return;

    if (Number.isNaN(nuevasHoras)) {
        mostrarMensaje("Escribe una cantidad de horas válida.", "error");
    } else if (!Number.isInteger(nuevasHoras)) {
        mostrarMensaje("Las horas deben ser un número entero.", "error");
    } else if (nuevasHoras < 1) {
        mostrarMensaje("La reserva mínima es de 1 hora. Si no la quieres, usa Eliminar.", "alerta");
    } else if (nuevasHoras > HORAS_MAXIMAS) {
        mostrarMensaje(`Puedes reservar máximo ${HORAS_MAXIMAS} horas por cancha.`, "alerta");
    } else {
        item.horas = nuevasHoras;
        guardarCarrito(carrito);
    }

    // Siempre se vuelve a pintar: si el valor era inválido, el input regresa al último valor guardado
    mostrarCarrito();
}

function eliminarItem(nombre) {
    if (!confirm(`¿Quieres eliminar ${nombre} de tus reservas?`)) return;

    const carrito = leerCarrito().filter(item => item.nombre !== nombre);
    guardarCarrito(carrito);
    mostrarCarrito();
    mostrarMensaje(`${nombre} se eliminó de tus reservas.`, "exito");
}

// Un solo listener para todos los botones de la lista
listaCarrito.addEventListener("click", (evento) => {
    const fila = evento.target.closest(".carrito-item");
    if (!fila) return;

    const nombre = fila.dataset.nombre;
    const horasActuales = Number(fila.querySelector(".input-horas").value);

    if (evento.target.closest(".btn-sumar")) {
        cambiarHoras(nombre, horasActuales + 1);
    } else if (evento.target.closest(".btn-restar")) {
        cambiarHoras(nombre, horasActuales - 1);
    } else if (evento.target.closest(".btn-eliminar")) {
        eliminarItem(nombre);
    }
});

// "change" se dispara cuando el usuario escribe un número y sale del campo (o presiona Enter)
listaCarrito.addEventListener("change", (evento) => {
    if (!evento.target.classList.contains("input-horas")) return;

    const nombre = evento.target.closest(".carrito-item").dataset.nombre;
    const texto = evento.target.value.trim();
    cambiarHoras(nombre, texto === "" ? NaN : Number(texto));
});

btnVaciar.addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres vaciar todas tus reservas?")) return;

    guardarCarrito([]);
    mostrarCarrito();
    mostrarMensaje("Tus reservas se vaciaron.", "exito");
});

mostrarCarrito();
