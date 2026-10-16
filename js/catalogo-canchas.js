// Crear listas por cancha
const canchas = [
    { nombre: "Cancha Marbella", ciudad: "Bogotá, Colombia", precio: "COP 90.000 / hora", imagen: "../img/Cancha-Futbol.jpg", balon: "../img/Balon-Futbol.jpg", deporte: "Fútbol" },
    { nombre: "Cancha El Paraiso", ciudad: "Medellín, Colombia", precio: "COP 60.000 / hora", imagen: "../img/Cancha-Baloncesto.jpg", balon: "../img/Balon-Baloncesto.jpg", deporte: "Baloncesto" },
    { nombre: "Cancha El Remate", ciudad: "Bogota, Colombia", precio: "COP 60.000 / hora", imagen: "../img/Cancha-Volley.jpg", balon: "../img/Balon-Volley.jpg", deporte: "Volleyball" },
    { nombre: "Cancha El Salitre", ciudad: "Bogota, Colombia", precio: "COP 150.000 / hora", imagen: "../img/Cancha-Tenis.jpg", balon: "../img/pelota-tenis.jpg", deporte: "Tennis" },
    { nombre: "Cancha San Cristobal", ciudad: "Bogota, Colombia", precio: "COP 180.000 / hora", imagen: "../img/Cancha-Americano.jpg", balon: "../img/Balon-Americano.jpg", deporte: "Futbol Americano" },
    { nombre: "Coliseo Municipal de Arequipa", ciudad: "Arequipa, Perú", precio: "PEN 80.00 / hora", imagen: "../img/Cancha-Volley.jpg", balon: "../img/Balon-Volley.jpg", deporte: "Voley" },
    { nombre: "Cancha Santiago Bernabéu de Lanificio", ciudad: "Arequipa, Perú", precio: "PEN 90.00 / hora", imagen: "../img/Cancha-Futbol.jpg", balon: "../img/Balon-Futbol.jpg", deporte: "Fútbol" },
    { nombre: "Cancha Campo de Marte", ciudad: "Lima, Perú", precio: "PEN 100.00 / hora", imagen: "../img/Cancha-Balon-mano.jpg", balon: "../img/Balon-Futbol.jpg", deporte: "Balón mano" },
    { nombre: "Cancha Arena 7", ciudad: "Lima, Perú", precio: "PEN 150.00 / hora", imagen: "../img/Cancha-Futbol.jpg", balon: "../img/Balon-Futbol.jpg", deporte: "Fútbol" },
    { nombre: "Cancha Lawn Tennis Sport", ciudad: "Lima, Perú", precio: "PEN 200.00 / hora", imagen: "../img/Cancha-Tenis.jpg", balon: "../img/pelota-tenis.jpg", deporte: "Tennis" },
    
];

// Se valida crear una tarjeta por cada cancha desde JS
const galeria = document.getElementById("galeria-canchas");

canchas.forEach(cancha => {
    galeria.innerHTML += `
        <div class="col">
            <div class="letter-card">
                <div class="card-inner">

                    <div class="card-front">
                        <img src="${cancha.imagen}" alt="Cancha de ${cancha.deporte}" class="card-foto">
                        <div class="card-datos">
                            <h2 class="card-nombre">${cancha.nombre}</h2>
                            <p>${cancha.ciudad}</p>
                            <p class="card-precio">${cancha.precio}</p>
                            <button class="btn btn-success btn-sm">Reservar</button>
                        </div>
                    </div>

                    <div class="card-back">
                        <img src="${cancha.balon}" alt="Balón de ${cancha.deporte}" class="img-balon">
                        <h2>${cancha.nombre}</h2>
                        <p>${cancha.deporte}</p>
                    </div>

                </div>
            </div>
        </div>
    `;
});

// Girar tarjetas
const tarjetas = document.querySelectorAll(".letter-card");

tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("click", () => {
        tarjeta.classList.toggle("flipped");
    });
});