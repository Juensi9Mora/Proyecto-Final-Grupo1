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
            filas += `
                <tr>
                    <td>${i + 1}</td>
                    <td><img src="${c.imagen}" class="imagen-cancha" alt="Cancha ${c.nombre}"></td>
                    <td>${c.nombre}</td>
                    <td>${c.pais}</td>
                    <td>${c.ciudad}</td>
                    <td>${c.categoria}</td>
                    <td>${c.moneda} ${Number(c.valor).toLocaleString("es-CO")}</td>
                    <td>
                        <button type="button" data-accion="estado" data-id="${i}">${c.activa ? "Desactivar" : "Activar"}</button>
                        <button type="button" data-accion="editar" data-id="${i}" ${!c.activa ? "disabled" : ""}>Editar</button>
                        <button type="button" data-accion="eliminar" data-id="${i}" ${!c.activa ? "disabled" : ""}>Eliminar</button>
                    </td>
                </tr>`;
        });

        this.listado.innerHTML = filas ? `
            <table>
                <thead>
                    <tr>
                        <th>N.º</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>País</th>
                        <th>Ciudad</th>
                        <th>Categoría</th>
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