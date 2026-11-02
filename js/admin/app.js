import { Administrador } from "./administrador.js";
import { iniciarFormularios, cargarCancha } from "./formularios.js";

let listado = document.getElementById("registrar_cancha");
let administrador = new Administrador(listado);

iniciarFormularios(administrador);

listado.addEventListener("click", (evento) => {
    let boton = evento.target.closest("button");
    if (!boton) return;

    let indice = Number(boton.dataset.id);
    let cancha = administrador.canchas[indice];
    let accion = boton.dataset.accion;

    if (accion === "estado") {
        administrador.cambiarEstado(indice);
    } else if (accion === "eliminar" && cancha.activa) {
        administrador.eliminar(indice);
    } else if (accion === "editar" && cancha.activa) {
        cargarCancha(cancha, indice);
    }
});

administrador.mostrar();