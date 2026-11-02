/* ALERTAS: mensajes que guían al usuario (exito, advertencia, error, info) */
export function mostrarAlerta(texto, tipo = "info") {
    const caja = document.getElementById("alertas");
    if (!caja) return;

    const alerta = document.createElement("div");
    alerta.className = `alerta alerta-${tipo}`;
    alerta.textContent = texto;
    caja.appendChild(alerta);
    while (caja.children.length > 3) caja.firstElementChild.remove();

    // El contenedor es un popover: se vuelve a mostrar para quedar por encima de los modales
    try {
        if (caja.matches(":popover-open")) caja.hidePopover();
        caja.showPopover();
    } catch { /* navegador sin popover: la alerta queda en pantalla igual */ }

    setTimeout(() => {
        alerta.remove();
        if (!caja.children.length) {
            try { caja.hidePopover(); } catch { /* nada */ }
        }
    }, 4500);
}
