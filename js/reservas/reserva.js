/* CLASE RESERVA: la lista de horarios que arma el usuario */
import { leerReserva, guardarReserva, leerConfirmadas, guardarConfirmadas, hora12 } from "./almacen.js";

export const HORA_INICIO = 6;   // primera hora jugable (6:00 a.m.)
export const HORA_FIN = 22;     // la cancha cierra (10:00 p.m.)
export const MAX_HORAS = 3;     // máximo de horas seguidas por horario

const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export class Reserva {
    constructor() {
        this.items = leerReserva();
    }

    guardar() {
        guardarReserva(this.items);
    }

    recargar() {
        this.items = leerReserva();
    }

    /* Mapa hora -> "ocupada" (reserva confirmada) | "propia" (ya está en tu lista) */
    horasOcupadas(canchaId, fecha, ignorarId = null) {
        const mapa = new Map();
        const marcar = (r, estado) => {
            for (let h = r.inicio; h < r.inicio + r.horas; h++) {
                if (!mapa.has(h)) mapa.set(h, estado);
            }
        };
        leerConfirmadas()
            .filter((r) => r.canchaId === canchaId && r.fecha === fecha)
            .forEach((r) => marcar(r, "ocupada"));
        this.items
            .filter((i) => i.id !== ignorarId && i.canchaId === canchaId && i.fecha === fecha)
            .forEach((i) => marcar(i, "propia"));
        return mapa;
    }

    agregar(cancha, fecha, horas) {
        if (!horas.length) {
            return { ok: false, msg: "Toca al menos una hora para poder agregarla." };
        }
        horas = [...horas].sort((a, b) => a - b);
        if (horas.length > MAX_HORAS) {
            return { ok: false, msg: `Puedes reservar máximo ${MAX_HORAS} horas seguidas por horario.` };
        }
        if (horas.some((h, i) => i > 0 && h - horas[i - 1] !== 1)) {
            return { ok: false, msg: "Las horas deben ser seguidas, sin huecos. Agrega los otros horarios por separado." };
        }
        if (this.items.length && this.items[0].moneda !== cancha.moneda) {
            return { ok: false, msg: `Tu reserva ya tiene canchas en ${this.items[0].moneda}. Confírmala o elimina esos horarios antes de reservar en ${cancha.moneda}.` };
        }

        const canchaId = cancha.id;
        const ocupadas = this.horasOcupadas(canchaId, fecha);
        if (horas.some((h) => ocupadas.has(h))) {
            return { ok: false, msg: "Alguna de esas horas ya no está libre. Elige otras." };
        }

        this.items.push({
            id: nuevoId(),
            canchaId,
            nombre: cancha.nombre,
            moneda: cancha.moneda,
            valor: Number(cancha.valor),
            fecha,
            inicio: horas[0],
            horas: horas.length
        });
        this.guardar();
        return { ok: true, msg: `Agregaste ${cancha.nombre}: ${hora12(horas[0])} a ${hora12(horas[0] + horas.length)}.` };
    }

    /* Cambia la cantidad de horas (extiende o acorta el final del horario) */
    cambiarHoras(id, valor) {
        const item = this.items.find((i) => i.id === id);
        if (!item) return { ok: false, msg: "No encontramos ese horario." };

        if (String(valor).trim() === "" || Number.isNaN(Number(valor))) {
            return { ok: false, msg: "La cantidad no puede estar vacía. Escribe cuántas horas quieres." };
        }
        const n = Number(valor);
        if (n < 0) return { ok: false, msg: "No se permiten cantidades negativas." };
        if (!Number.isInteger(n)) return { ok: false, msg: "Usa un número entero de horas." };
        if (n < 1) return { ok: false, msg: "La cantidad mínima es 1 hora. Si ya no lo quieres, toca Eliminar." };
        if (n > MAX_HORAS) return { ok: false, msg: `El máximo es ${MAX_HORAS} horas por horario.` };
        if (item.inicio + n > HORA_FIN) return { ok: false, msg: `La cancha cierra a las ${hora12(HORA_FIN)}.` };

        const ocupadas = this.horasOcupadas(item.canchaId, item.fecha, item.id);
        for (let h = item.inicio; h < item.inicio + n; h++) {
            if (ocupadas.has(h)) return { ok: false, msg: `${hora12(h)} ya está ocupada, no puedes extender más.` };
        }

        item.horas = n;
        this.guardar();
        return { ok: true };
    }

    eliminar(id) {
        this.items = this.items.filter((i) => i.id !== id);
        this.guardar();
    }

    totalHoras() {
        return this.items.reduce((suma, i) => suma + i.horas, 0);
    }

    total() {
        return this.items.reduce((suma, i) => suma + i.valor * i.horas, 0);
    }

    moneda() {
        return this.items[0]?.moneda ?? "";
    }

    /* Pasa la lista a "reservas confirmadas" y la vacía */
    confirmar(datos) {
        for (const i of this.items) {
            const ocupadas = this.horasOcupadas(i.canchaId, i.fecha, i.id);
            for (let h = i.inicio; h < i.inicio + i.horas; h++) {
                if (ocupadas.get(h) === "ocupada") {
                    return { ok: false, msg: `${i.nombre}: ${hora12(h)} ya fue reservada por alguien más. Ajusta tu selección.` };
                }
            }
        }

        const confirmadas = leerConfirmadas();
        const creada = new Date().toISOString();
        this.items.forEach((i) => confirmadas.push({ ...i, total: i.valor * i.horas, ...datos, creada }));
        guardarConfirmadas(confirmadas);

        const cantidad = this.items.length;
        this.items = [];
        this.guardar();
        return { ok: true, msg: `¡Reserva confirmada! Registramos ${cantidad} ${cantidad === 1 ? "horario" : "horarios"}.` };
    }
}
