// 1. ELEMENTOS DEL HTML
let formularioInicial = document.getElementById("formulario-inicial");
let formulario = document.getElementById("formulario-detalles");
let seccion = document.getElementById("seccion-detalles");
let listado = document.getElementById("registrar_cancha");
let nombreInicial = document.getElementById("nombre-inicial");
let nombre = document.getElementById("nombre-cancha");
let imagen = document.getElementById("imagen");
let vista = document.getElementById("vista-imagen");
let pais = document.getElementById("pais");
let ciudad = document.getElementById("ciudad");
let categoria = document.getElementById("categoria");
let moneda = document.getElementById("moneda");
let valor = document.getElementById("valor");
let titulo = document.getElementById("titulo-detalles");
let guardar = document.getElementById("guardar");
let cancelar = document.getElementById("cancelar");

let canchas = JSON.parse(localStorage.getItem("canchasMiCancha")) || [], edicion = -1;

// 2. LEER IMAGEN
function leerImagen(archivo) {
    return new Promise((resolver, rechazar) => {
        const lector = new FileReader();
        lector.onload = () => resolver(lector.result);
        lector.onerror = rechazar;
        lector.readAsDataURL(archivo);
    });
}

// 3. CIUDADES Y MONEDA
function actualizarCiudades() {
    const ciudades = { Colombia: ["Bogotá", "Medellín"], Peru: ["Lima", "Arequipa"] };
    ciudad.innerHTML = '<option value="">Selecciona una ciudad</option>';
    (ciudades[pais.value] || []).forEach(c => ciudad.innerHTML += `<option>${c}</option>`);
    moneda.value = pais.value === "Colombia" ? "COP" : ciudades[pais.value] ? "PEN" : "";
}
pais.addEventListener("change", actualizarCiudades);

// 4. MOSTRAR CANCHAS
function mostrarCanchas() {
    let filas = "";
    canchas.forEach((c, i) => filas += `
    <tr>
        <td>${i + 1}</td>
        <td><img src="${c.imagen}" class="imagen-cancha" alt="Cancha"></td>
        <td>${c.nombre}</td>
        <td>${c.pais}</td>
        <td>${c.ciudad}</td><td>${c.categoria}</td>
        <td>${c.moneda} ${Number(c.valor).toLocaleString("es-CO")}</td>
        <td>
            <button data-accion="estado" data-id="${i}">${c.activa ? "Desactivar" : "Activar"}</button>
            <button data-accion="editar" data-id="${i}" ${!c.activa ? "disabled" : ""}>Actualizar</button>
            <button data-accion="eliminar" data-id="${i}" ${!c.activa ? "disabled" : ""}>Eliminar</button>
        </td>
    </tr>`);

    listado.innerHTML = canchas.length
        ? `<table>
                <thead>
                    <tr>
                        <th>N.º</th>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>País</th>
                        <th>Ciudad</th>
                        <th>Categoría</th>
                        <th>Valor/hora</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
           </table>`
        : "<p>No hay canchas registradas.</p>";

    localStorage.setItem("canchasMiCancha", JSON.stringify(canchas));
}

// 5. LIMPIAR
function limpiar() {
    formulario.reset(); imagen.value = vista.src = "";
    vista.hidden = true; imagen.required = true;
    edicion = -1; seccion.hidden = true;
}

// 6. REGISTRAR Y ACTUALIZAR
formulario.addEventListener("submit", async e => {
    e.preventDefault();
    const archivo = imagen.files[0];
    if (archivo && !archivo.type.startsWith("image/")) return alert("Selecciona una imagen válida.");

    try {
        const foto = archivo ? await leerImagen(archivo) : canchas[edicion]?.imagen;
        if (!foto) return alert("Selecciona una imagen.");

        const cancha = {
            nombre: nombre.value.trim(), pais: pais.value, ciudad: ciudad.value,
            categoria: categoria.value, moneda: moneda.value, valor: Number(valor.value),
            imagen: foto, activa: edicion >= 0 ? canchas[edicion].activa : true
        };
        edicion < 0 ? canchas.push(cancha) : canchas[edicion] = cancha;
        nombreInicial.value = cancha.nombre;
        limpiar(); mostrarCanchas();
    } catch { alert("No se pudo cargar la imagen."); }
});

// 7. ABRIR FORMULARIO
formularioInicial.addEventListener("submit", e => {
    e.preventDefault(); limpiar(); actualizarCiudades();
    nombre.value = nombreInicial.value.trim();
    titulo.textContent = "Información de la cancha";
    guardar.textContent = "Guardar"; seccion.hidden = false;
});

// 8. VISTA PREVIA
imagen.addEventListener("change", async () => {
    const archivo = imagen.files[0];
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) return alert("Selecciona una imagen válida.");
    try { vista.src = await leerImagen(archivo); vista.hidden = false; }
    catch { alert("No se pudo mostrar la imagen."); }
});

// 9. CANCELAR
cancelar.addEventListener("click", limpiar);

// 10. ACCIONES
listado.addEventListener("click", e => {
    const boton = e.target.closest("button");
    if (!boton) return;
    const i = Number(boton.dataset.id), c = canchas[i], accion = boton.dataset.accion;
    if (!c) return;

    if (accion === "estado") c.activa = !c.activa;
    else if (accion === "eliminar" && c.activa) canchas.splice(i, 1);
    else if (accion === "editar" && c.activa) {
        edicion = i;
        nombre.value = c.nombre; pais.value = c.pais; actualizarCiudades();
        ciudad.value = c.ciudad; categoria.value = c.categoria;
        moneda.value = c.moneda; valor.value = c.valor;
        imagen.required = false; vista.src = c.imagen; vista.hidden = false;
        titulo.textContent = "Actualizar cancha";
        guardar.textContent = "Guardar cambios"; seccion.hidden = false;
        return;
    } else return;
    mostrarCanchas();
});

// 11. INICIAR
actualizarCiudades();
mostrarCanchas();