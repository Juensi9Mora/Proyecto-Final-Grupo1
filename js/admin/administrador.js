/* CLASE ADMINISTRADOR */
export class Administrador {
    constructor(listado) {
        this.canchas = JSON.parse(
            localStorage.getItem("canchasMiCancha")
        ) || [];

        this.listado = listado;
    }

    guardarDatos() {
        localStorage.setItem(
            "canchasMiCancha",
            JSON.stringify(this.canchas)
        );
    }

    mostrar() {
        let filas = "";
        // Recorrer las canchas con forEach.
        this.canchas.forEach((c, i) => {
            const categoriaCompleta = c.categoria === "Fútbol" && c.subcategoria
                ? `${c.categoria} - ${c.subcategoria}`
                : c.categoria;

            filas += `
                <tr>
                    <td data-label="N.º">${i + 1}</td>
                    <td data-label="Imagen">
                        <img src="${c.imagen}" class="imagen-cancha" alt="Cancha ${c.nombre}">
                    </td>
                    <td data-label="Nombre">${c.nombre}</td>
                    <td data-label="País">${c.pais}</td>
                    <td data-label="Ciudad">${c.ciudad}</td>
                    <td data-label="Dirección">${c.direccion || "Sin dirección"}</td>
                    <td data-label="Categoría">${categoriaCompleta || "Sin categoría"}</td>
                    <td data-label="Descripción">${c.detalle || "Sin descripción"}</td>
                    <td data-label="Precio/hora">${c.moneda} ${Number(c.valor).toLocaleString("es-CO")}</td>
                    <td data-label="Acciones" class="acciones">
                        <div class="acciones-tabla">
                            <button type="button" data-accion="estado" data-id="${i}">${c.activa ? "Desactivar" : "Activar"}</button>
                            <button type="button" data-accion="editar" data-id="${i}" ${!c.activa ? "disabled" : ""}>Editar</button>
                            <button type="button" data-accion="eliminar" data-id="${i}" ${!c.activa ? "disabled" : ""}>Eliminar</button>
                        </div>
                    </td>
                </tr>`;
        });

        this.listado.innerHTML = filas ? `
            <table class="tabla-canchas-admin">
                <thead>
                    <tr>
                        <th>N.º</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>País</th>
                        <th>Ciudad</th>
                        <th>Dirección</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th>Precio/hora</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        ` : "<p>No hay canchas registradas.</p>";

        this.guardarDatos();
    }

    guardarCancha(cancha, edicion) {
        if (edicion === -1) {
            this.canchas.push(cancha);
        } else {
            this.canchas[edicion] = cancha;
        }

        this.mostrar();
    }

    eliminar(i) {
        this.canchas.splice(i, 1);
        this.mostrar();
    }

    cambiarEstado(i) {
        this.canchas[i].activa = !this.canchas[i].activa;
        this.mostrar();
    }
}