const formulario = document.getElementById('formulario');

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener los datos
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const asunto = document.getElementById('asunto').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    // Validar campos vacíos
    const campos = { Nombre: nombre, Correo: email, Teléfono: telefono, Asunto: asunto, Mensaje: mensaje };
    const faltantes = Object.keys(campos).filter(campo => !campos[campo]);

    if (faltantes.length > 0) {
        Swal.fire({
            icon: 'warning',
            title: faltantes.length === 1 ? `Falta el campo: ${faltantes[0]}` : 'Campos incompletos',
            html: faltantes.join('<br>'),
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Validar los datos
    let error = '';

    if (nombre.length < 3) error = 'El nombre debe tener al menos 3 caracteres.';
    else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(email))
        error = 'Ingresa un correo electrónico válido.';
    else if (!/^[0-9]{10}$/.test(telefono))
        error = 'El teléfono debe tener exactamente 10 dígitos.';
    else if (mensaje.length < 10)
        error = 'El mensaje debe tener al menos 10 caracteres.';

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Datos no válidos',
            text: error,
            confirmButtonText: 'Corregir'
        });
        return;
    }

    // Mostrar datos y confirmar
    console.log({ nombre, email, telefono, asunto, mensaje });

    Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: `Gracias, ${nombre}. Tus datos se validaron correctamente.`,
        confirmButtonText: 'Aceptar'
    }).then(() => formulario.reset());
});