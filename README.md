# ⚽ Mi Cancha (continua en construccion mientras se finaliza el proyecto)

> **Tu próximo partido comienza aquí.**
> Plataforma web para encontrar, consultar y reservar canchas deportivas en **Colombia y Perú**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)
![Figma](https://img.shields.io/badge/Prototipo-Figma-F24E1E?logo=figma&logoColor=white)

---

## 📌 Descripción

Hoy la oferta de canchas deportivas está dispersa: cada complejo publica sus horarios y precios por separado. **Mi Cancha** reúne esa oferta en un catálogo comparable, donde la persona puede elegir deporte, ciudad, horario y precio, y reservar en pocos pasos.

**Misión:** brindar una plataforma accesible, segura y fácil de usar para encontrar y reservar espacios deportivos de forma rápida.
**Visión:** ser la plataforma de referencia para la reserva de espacios deportivos en la región.

## ✨ Funcionalidades

| Página | Qué incluye |
|---|---|
| **Inicio** | Hero con video de fondo, llamada a la acción «Reservar ahora» y presentación de la plataforma |
| **Nosotros** | Misión, visión, diferenciadores y tarjetas del equipo |
| **Catálogo de canchas** | Tarjetas creadas con JavaScript desde una lista de datos; giran al hacer clic para mostrar más detalles |
| **Contacto** | Formulario con validación en JavaScript y canales de atención (correo, WhatsApp, horario) |
| **Dashboard** | 🚧 En desarrollo |
| **Registro / Login** | 🚧 En desarrollo |

Todas las páginas comparten una **navbar responsive** (con menú hamburguesa en celular) y un **footer** común.

## 🛠️ Tecnologías

- HTML5, CSS3 y JavaScript (sin frameworks)
- [Bootstrap 5.3.8](https://getbootstrap.com/) (por CDN)
- [Bootstrap Icons 1.13.1](https://icons.getbootstrap.com/) (por CDN)
- Figma para el prototipo (baja, media y alta fidelidad)
- Git y GitHub para el trabajo en equipo

## 📁 Estructura del proyecto

```
mi-cancha/
├── css/
│   ├── style.css              # Colores, navbar y footer compartidos
│   ├── nosotros.css
│   ├── catalogo-canchas.css
│   └── contacto.css
├── js/
│   ├── nosotros.js            # Menú hamburguesa y navbar con scroll
│   ├── catalogo-canchas.js    # Lista de canchas, tarjetas y giro
│   ├── contacto.js            # Validación del formulario
│   └── index.js
├── img/                       # Logo, canchas, balones y avatares
├── video/                     # Video del hero de Inicio
├── pages/
│   ├── index.html
│   ├── nosotros.html
│   ├── catalogo-canchas.html
│   └── contacto.html
└── README.md
```

## 🚀 Cómo ejecutarlo

1. Clona el repositorio:
   ```bash
   git clone <URL-DEL-REPOSITORIO>
   cd mi-cancha
   ```
2. Ábrelo en **Visual Studio Code**.
3. Instala la extensión **Live Server** y haz clic derecho en `pages/index.html` → **Open with Live Server**.

> 💡 Abre el proyecto desde la carpeta raíz. La página de Contacto usa rutas que empiezan con `/`, que solo funcionan con un servidor local (como Live Server) y no abriendo el archivo directamente.

## 🎨 Paleta de colores

| Color | Hex | Uso |
|---|---|---|
| Verde marca | `#00843D` | Botones principales, iconos y enlaces activos |
| Verde oscuro | `#006B32` | Navbar, hover y énfasis |
| Verde cancha | `#00A650` | Acciones destacadas e indicadores |
| Verde menta | `#D9F2E3` | Etiquetas y bloques informativos |
| Verde niebla | `#F1F8F3` | Fondos de sección y tarjetas suaves |
| Naranja deportivo | `#FF8737` | Llamadas a la acción y promociones |
| Carbón verdoso | `#26372E` | Títulos y footer |
| Gris verdoso | `#64736A` | Textos secundarios |
| Gris separación | `#E5E9E6` | Bordes y divisores |

Los colores están definidos como variables CSS en `css/style.css` (por ejemplo `var(--verdeMarca)`).

## ➕ Cómo agregar una cancha al catálogo

En `js/catalogo-canchas.js`, copia un bloque dentro de la lista `canchas` y cambia sus datos:

```javascript
{
    nombre: "Cancha Marbella",
    ciudad: "Bogotá, Colombia",
    precio: "COP 90.000 / hora",
    imagen: "../img/Cancha-Futbol.jpg",
    balon: "../img/Balon-Futbol.jpg",
    deporte: "Fútbol"
}
```

La tarjeta se crea sola; no hay que tocar el HTML.

## 👥 Equipo

| Integrante | Pantallas |
|---|---|
| Carolayn | Wireframes -- Acerca de nosotros -- Catalogo de Canchas |
| Jennifer | Catálogo de deportes |
| Andres Satoba | Contacto |
| Caleb |  |
| Yesid | Registro / Login -- Contacto |

## 🗺️ Próximos pasos

- [ ] Dashboard del usuario (reservas, próximas reservas)
- [ ] Páginas de Registro e Inicio de sesión
- [ ] Filtros del catálogo (deporte, país o ciudad, precio y horario)
- [ ] Paginación del catálogo
- [ ] Flujo de reserva conectado al botón «Reservar»
- [ ] Enlaces del footer (preguntas frecuentes, términos y privacidad)
- [ ] Más deportes y más ciudades de Colombia y Perú

## 🤝 Flujo de trabajo en equipo

1. Cada integrante trabaja en su propia rama: `git checkout -b feature/nombre-de-la-pantalla`
2. Hace commits pequeños y claros: `git commit -m "Agrega tarjetas del catálogo"`
3. Sube su rama y abre un **Pull Request** para que otra persona lo revise antes de unirlo a `main`.

---

<p align="center">© 2026 Mi Cancha · Hecho en equipo para Colombia y Perú 🇨🇴 🇵🇪</p>