const formulario = document.getElementById('formulario');
const respuesta = document.getElementById('respuesta-formulario');

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener los datos
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const asunto = document.getElementById('asunto').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    // Validar campos vacíos
    if (!nombre || !email || !telefono || !asunto || !mensaje) {
        respuesta.textContent = 'Completa todos los campos.';
        return;
    }

    // Validar nombre
    if (nombre.length <= 15) {
        respuesta.textContent = 'El nombre debe tener al menos 3 caracteres.';
        return;
    }

    // Validar correo electrónico
    const patronEmail = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

    if (!patronEmail.test(email)) {
        respuesta.textContent = 'Ingresa un correo electrónico válido.';
        return;
    }

    // Validar teléfono
    if (!/^[0-9]{10}$/.test(telefono)) {
        respuesta.textContent = 'El teléfono debe tener 10 dígitos.';
        return;
    }

    // Validar mensaje
    if (mensaje.length < 10) {
        respuesta.textContent = 'El mensaje debe tener al menos 10 caracteres.';
        return;
    }

    // Organizar los datos
    const contacto = {
        nombre,
        email,
        telefono,
        asunto,
        mensaje
    };

    // Mostrar los datos en consola
    console.log(contacto);

    // Mostrar confirmación
    respuesta.textContent = '¡Formulario validado correctamente!';

    // Limpiar formulario
    formulario.reset();
});