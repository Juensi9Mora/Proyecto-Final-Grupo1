// Funciones compartidas del carrito de reservas.
// Se cargan en catalogo-canchas.html y en carrito.html antes de su script propio.

const CLAVE_CARRITO = "carritoMiCancha";
const HORAS_MAXIMAS = 8;

// Lee el carrito guardado. Si no hay nada (o está dañado) devuelve una lista vacía
function leerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Convierte "COP 60.000 / hora" en { moneda: "COP", valor: 60000 }
// y "PEN 80.00 / hora" en { moneda: "PEN", valor: 80 }
function convertirPrecio(texto) {
    const [moneda, numero] = texto.trim().split(" ");
    const valor = moneda === "COP"
        ? Number(numero.replace(/\./g, ""))  // en COP el punto separa miles
        : Number(numero);                    // en PEN el punto es decimal
    return { moneda, valor };
}

function formatearPrecio(valor, moneda) {
    const decimales = moneda === "COP" ? 0 : 2;
    return `${moneda} ${valor.toLocaleString("es-CO", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}`;
}

// Agrega una cancha al carrito. Si ya estaba, le suma una hora
function agregarAlCarrito(cancha) {
    const carrito = leerCarrito();
    const existente = carrito.find(item => item.nombre === cancha.nombre);

    if (existente) {
        if (existente.horas >= HORAS_MAXIMAS) {
            mostrarMensaje(`Ya tienes el máximo de ${HORAS_MAXIMAS} horas en ${cancha.nombre}.`, "alerta");
            return;
        }
        existente.horas++;
        mostrarMensaje(`Sumaste 1 hora a ${cancha.nombre} (${existente.horas} en total).`, "exito");
    } else {
        const { moneda, valor } = convertirPrecio(cancha.precio);
        carrito.push({
            nombre: cancha.nombre,
            ciudad: `${cancha.ciudad}, ${cancha.pais}`,
            deporte: cancha.deporte,
            imagen: cancha.imagen,
            moneda,
            valor,
            horas: 1
        });
        mostrarMensaje(`${cancha.nombre} se agregó a tus reservas.`, "exito");
    }

    guardarCarrito(carrito);
}

// Muestra un aviso flotante que desaparece solo después de unos segundos
// tipo: "exito" | "alerta" | "error"
function mostrarMensaje(texto, tipo = "exito") {
    let contenedor = document.getElementById("mensajes");
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "mensajes";
        contenedor.className = "mensajes";
        document.body.appendChild(contenedor);
    }

    const mensaje = document.createElement("div");
    mensaje.className = `mensaje mensaje-${tipo}`;
    mensaje.setAttribute("role", "alert");
    mensaje.textContent = texto;
    contenedor.appendChild(mensaje);

    setTimeout(() => mensaje.remove(), 3500);
}
