// Crear listas por cancha
const canchas = [
    { nombre: "Cancha Marbella", ciudad: "Bogotá, Colombia", precio: "COP 90.000 / hora", imagen: "../img/Cancha-Futbol.jpg", balon: "../img/Balon-Futbol.jpg", deporte: "Fútbol" },
    { nombre: "Cancha El Paraiso", ciudad: "Medellín, Colombia", precio: "COP 60.000 / hora", imagen: "../img/Cancha-Baloncesto.jpg", balon: "../img/Balon-Baloncesto.jpg", deporte: "Baloncesto" },
    { nombre: "Cancha El Remate", ciudad: "Bogota, Colombia", precio: "COP 60.000 / hora", imagen: "../img/Cancha-Volley.jpg", balon: "../img/Balon-Volley.jpg", deporte: "Volleyball" },
    
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