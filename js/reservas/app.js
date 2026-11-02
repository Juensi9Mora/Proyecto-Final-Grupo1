/* APP DE RESERVAS: pinta la vista y conecta los eventos */
import { Reserva, MAX_HORAS } from "./reserva.js";
import { mostrarAlerta } from "./alertas.js";
import {
    leerUsuario, esc, dinero, hora12,
    fechaISO, fechaLarga, nombreDia, nombreMes
} from "./almacen.js";
import { obtenerCanchas } from "../services/canchasService.js";

const ids = ["sede", "deporte", "cancha", "dias", "mes", "horas", "agregar", "lista-reserva",
    "resumen-items", "resumen-horas", "total-etiqueta", "total", "reservar",
    "modal-acceso", "modal-datos", "form-datos", "m-nombre", "m-telefono", "m-jugadores", "m-pago", "m-notas"];
const el = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

const reserva = new Reserva();
let fechaSel = fechaISO(new Date());

const canchasActivas = () => obtenerCanchas();
const canchaActual = () => canchasActivas().find((c) => c.id === el.cancha.value);

/* ---------- Filtros: sede -> deporte -> cancha ---------- */
function llenarSelect(select, opciones, actual) {
    select.innerHTML = opciones.map((o) => `<option value="${esc(o.valor)}">${esc(o.texto)}</option>`).join("");
    select.value = opciones.some((o) => o.valor === actual) ? actual : (opciones[0]?.valor ?? "");
}

function actualizarFiltros() {
    const activas = canchasActivas();
    const sedeDe = (c) => c.sede;

    const sedes = [...new Set(activas.map(sedeDe))];
    llenarSelect(el.sede, sedes.map((s) => ({ valor: s, texto: s })), el.sede.value);

    const enSede = activas.filter((c) => sedeDe(c) === el.sede.value);
    const deportes = [...new Set(enSede.map((c) => c.categoria))];
    llenarSelect(el.deporte, deportes.map((d) => ({ valor: d, texto: d })), el.deporte.value);

    const lista = enSede.filter((c) => c.categoria === el.deporte.value);
    llenarSelect(el.cancha, lista.map((c) => ({
        valor: c.id,
        texto: `${c.nombre} - ${dinero(c.moneda, c.valor)}/hora`
    })), el.cancha.value);

    pintarHoras();
}

/* ---------- Días: hoy + 6 ---------- */
function pintarDias() {
    const dias = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });
    el.dias.innerHTML = dias.map((d) => `
        <label class="dia">
            <input type="radio" name="dia" value="${fechaISO(d)}" ${fechaISO(d) === fechaSel ? "checked" : ""}>
            <span><b>${nombreDia(d)}</b>${d.getDate()}</span>
        </label>`).join("");

    const [primero, ultimo] = [dias[0], dias[6]];
    el.mes.textContent = primero.getMonth() === ultimo.getMonth()
        ? `${nombreMes(primero)} ${primero.getFullYear()}`
        : `${nombreMes(primero)} - ${nombreMes(ultimo)} ${ultimo.getFullYear()}`;
}

/* ---------- Horas ---------- */
function pintarHoras() {
    const cancha = canchaActual();
    if (!cancha) {
        el.horas.innerHTML = '<p class="vacio">Aún no hay canchas disponibles. Un administrador debe registrarlas en el panel.</p>';
        el.agregar.disabled = true;
        return;
    }
    el.agregar.disabled = false;

    const ocupadas = reserva.horasOcupadas(cancha.id, fechaSel);
    const ahora = new Date();
    const esHoy = fechaISO(ahora) === fechaSel;
    const franjas = [["Mañana", 6, 11], ["Tarde", 12, 17], ["Noche", 18, 21]];
    const etiquetas = { ocupada: "Ocupada", propia: "En tu reserva", pasada: "Ya pasó" };

    el.horas.innerHTML = franjas.map(([nombre, desde, hasta]) => {
        let botones = "";
        for (let h = desde; h <= hasta; h++) {
            const estado = ocupadas.get(h) || (esHoy && h <= ahora.getHours() ? "pasada" : "");
            botones += `
                <label class="hora">
                    <input type="checkbox" name="hora" value="${h}" ${estado ? "disabled" : ""}>
                    <span>${hora12(h)}<small>${etiquetas[estado] || dinero(cancha.moneda, cancha.valor)}</small></span>
                </label>`;
        }
        return `<h3 class="franja">${nombre}</h3><div class="horas">${botones}</div>`;
    }).join("");
}

/* ---------- Lista de la reserva + resumen ---------- */
function pintarReserva() {
    const canchas = obtenerCanchas();

    if (!reserva.items.length) {
        el["lista-reserva"].innerHTML = '<p class="vacio">Aún no has agregado horarios. Elige cancha, día y horas, y toca "Agregar a mi reserva".</p>';
    } else {
        el["lista-reserva"].innerHTML = reserva.items.map((i) => {
            const c = canchas.find((x) => x.id === i.canchaId);
            const imagen = c?.imagen
                ? `<img src="${c.imagen}" alt="${esc(i.nombre)}">`
                : '<div class="sin-imagen" aria-hidden="true"></div>';
            const descripcion = c ? `${c.categoria} en ${c.sede}` : "Esta cancha ya no está disponible";
            return `
                <article class="item" data-id="${i.id}">
                    ${imagen}
                    <div class="item-info">
                        <h3>${esc(i.nombre)}</h3>
                        <p>${esc(descripcion)}</p>
                        <p class="item-fecha">${fechaLarga(i.fecha)}, ${hora12(i.inicio)} a ${hora12(i.inicio + i.horas)}</p>
                        <p class="item-tarifa">${dinero(i.moneda, i.valor)} por hora</p>
                    </div>
                    <div class="item-controles">
                        <div class="cantidad" role="group" aria-label="Horas">
                            <button type="button" data-accion="menos" aria-label="Quitar una hora">&minus;</button>
                            <input type="number" inputmode="numeric" min="1" max="${MAX_HORAS}" value="${i.horas}" aria-label="Cantidad de horas">
                            <button type="button" data-accion="mas" aria-label="Agregar una hora">+</button>
                        </div>
                        <strong>${dinero(i.moneda, i.valor * i.horas)}</strong>
                        <button type="button" class="item-eliminar" data-accion="eliminar">Eliminar</button>
                    </div>
                </article>`;
        }).join("");
    }

    const horas = reserva.totalHoras();
    el["resumen-items"].textContent = reserva.items.length;
    el["resumen-horas"].textContent = horas;
    el["total-etiqueta"].textContent = `Total por ${horas} ${horas === 1 ? "hora" : "horas"}`;
    el.total.textContent = reserva.items.length ? dinero(reserva.moneda(), reserva.total()) : "-";
    el.reservar.disabled = !reserva.items.length;
}

const refrescar = () => { pintarReserva(); pintarHoras(); };

/* ---------- Eventos de la selección ---------- */
[el.sede, el.deporte, el.cancha].forEach((s) => s.addEventListener("change", actualizarFiltros));

el.dias.addEventListener("change", (e) => {
    fechaSel = e.target.value;
    pintarHoras();
});

el.horas.addEventListener("change", (e) => {
    if (el.horas.querySelectorAll("input:checked").length > MAX_HORAS) {
        e.target.checked = false;
        mostrarAlerta(`Máximo ${MAX_HORAS} horas seguidas por horario.`, "advertencia");
    }
});

el.agregar.addEventListener("click", () => {
    const cancha = canchaActual();
    if (!cancha) return mostrarAlerta("Primero elige una cancha.", "advertencia");

    const horas = [...el.horas.querySelectorAll("input:checked")].map((i) => Number(i.value));
    const r = reserva.agregar(cancha, fechaSel, horas);
    mostrarAlerta(r.msg, r.ok ? "exito" : "advertencia");
    if (r.ok) refrescar();
});

/* ---------- Eventos de la lista: +, -, escribir, eliminar ---------- */
el["lista-reserva"].addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;

    const id = boton.closest(".item").dataset.id;
    const item = reserva.items.find((i) => i.id === id);
    const accion = boton.dataset.accion;

    if (accion === "eliminar") {
        reserva.eliminar(id);
        mostrarAlerta("Quitaste ese horario de tu reserva.", "info");
    } else {
        const r = reserva.cambiarHoras(id, item.horas + (accion === "mas" ? 1 : -1));
        if (!r.ok) mostrarAlerta(r.msg, "advertencia");
    }
    refrescar();
});

el["lista-reserva"].addEventListener("change", (e) => {
    if (!e.target.matches("input[type='number']")) return;
    const r = reserva.cambiarHoras(e.target.closest(".item").dataset.id, e.target.value);
    if (!r.ok) mostrarAlerta(r.msg, "advertencia");
    refrescar(); // si el valor era inválido, se vuelve a pintar el valor guardado
});

/* ---------- Confirmar: sin sesión -> acceso, con sesión -> datos ---------- */
function llenarMini() {
    const horas = reserva.totalHoras();
    const lineas = reserva.items.map((i) =>
        `<span>${esc(i.nombre)}: ${fechaLarga(i.fecha)}, ${hora12(i.inicio)} a ${hora12(i.inicio + i.horas)}</span>`).join("");
    document.querySelectorAll(".mini-resumen").forEach((m) => {
        m.innerHTML = `<b>${horas} ${horas === 1 ? "hora" : "horas"} en total</b>${lineas}<strong>${dinero(reserva.moneda(), reserva.total())}</strong>`;
    });
}

el.reservar.addEventListener("click", () => {
    if (!reserva.items.length) {
        return mostrarAlerta("Agrega al menos un horario antes de reservar.", "advertencia");
    }

    const activas = canchasActivas();
    const perdida = reserva.items.find((i) => !activas.some((c) => c.id === i.canchaId));
    if (perdida) {
        return mostrarAlerta(`${perdida.nombre} ya no está disponible. Elimínala de tu reserva para continuar.`, "error");
    }

    llenarMini();
    const usuario = leerUsuario();
    if (!usuario) {
        mostrarAlerta("Inicia sesión o crea una cuenta para confirmar tu reserva.", "info");
        el["modal-acceso"].showPopover();
    } else {
        el["m-nombre"].value = usuario.nombre ?? "";
        el["modal-datos"].showPopover();
    }
});

el["form-datos"].addEventListener("submit", (e) => {
    e.preventDefault();

    const telefono = el["m-telefono"].value.replace(/[\s()-]/g, "");
    if (!/^\+?\d{7,15}$/.test(telefono)) {
        mostrarAlerta("Escribe un teléfono válido, solo números. Ej: +57 300 000 0000.", "error");
        return el["m-telefono"].focus();
    }
    const jugadores = Number(el["m-jugadores"].value);
    if (!Number.isInteger(jugadores) || jugadores < 1 || jugadores > 22) {
        mostrarAlerta("El número de jugadores debe ser un entero entre 1 y 22.", "error");
        return el["m-jugadores"].focus();
    }

    const r = reserva.confirmar({
        usuario: el["m-nombre"].value,
        telefono,
        jugadores,
        pago: el["m-pago"].value,
        notas: el["m-notas"].value.trim()
    });
    mostrarAlerta(r.msg, r.ok ? "exito" : "error");
    if (r.ok) {
        el["modal-datos"].hidePopover();
        el["form-datos"].reset();
    }
    refrescar();
});

/* Si el usuario edita en otra pestaña (panel o reservas), esta se actualiza sola */
window.addEventListener("storage", () => {
    reserva.recargar();
    actualizarFiltros();
    pintarReserva();
});

/* Llega desde el catálogo con ?cancha=<id>: deja esa cancha preseleccionada */
function seleccionarDesdeCatalogo() {
    const id = new URLSearchParams(window.location.search).get("cancha");
    const c = id && canchasActivas().find((x) => x.id === id);
    if (!c) return;
    el.sede.value = c.sede;
    actualizarFiltros();
    el.deporte.value = c.categoria;
    actualizarFiltros();
    el.cancha.value = c.id;
    actualizarFiltros();
}

/* ---------- Inicio ---------- */
pintarDias();
actualizarFiltros();
seleccionarDesdeCatalogo();
pintarReserva();
if (!canchasActivas().length) {
    mostrarAlerta("Todavía no hay canchas activas. Regístralas en el panel administrativo.", "info");
}
