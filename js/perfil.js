// Verificar que la sesión este activa al cargar la página
const sesionActiva = JSON.parse(localStorage.getItem("usuarioActivo") || "null");
if (!sesionActiva) {
    window.location.href = "inicio_sesion.html";
}

// Si la clave del perfil esta vinculada al correo del usuario logueado
const STORAGE_KEY = `miCanchaPerfil_${sesionActiva.correo}`;
const $ = (selector) => document.querySelector(selector);

function dateAtDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().slice(0, 10);
}

function dateInDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
}

const initialData = {
    profile: {
        name: "Angel Muñoz",
        email: "munoz98@email.com",
        city: "Bogotá"
        },
        role: "deportista",
        reservations: [
        { id: 1, court: "Cancha La Bombonera", sport: "Fútbol 5", date: dateAtDaysAgo(3), time: "16:00", status: "realizada" },
        { id: 2, court: "Cancha Los Campeones", sport: "Fútbol 8", date: dateAtDaysAgo(10), time: "10:00", status: "realizada" },
        { id: 3, court: "Cancha La Bombonera", sport: "Fútbol 5", date: dateInDays(2), time: "16:00", status: "confirmada" }
        ],
        favorites: [
        { name: "Cancha La Bombonera", type: "Fútbol 5" },
        { name: "Cancha Los Campeones", type: "Fútbol 8" }
        ],
        courts: [
        { name: "Cancha La Bombonera", type: "Fútbol 5" },
        { name: "Cancha Los Campeones", type: "Fútbol 8" }
        ]
    };

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const base = saved ? { ...initialData, ...JSON.parse(saved) } : structuredClone(initialData);
        
        // Sincronizar datos reales del usuario logueado
        base.profile.name = sesionActiva.nombre;
        base.profile.email = sesionActiva.correo;
        base.profile.city = sesionActiva.ciudad || base.profile.city;
        return base;
    } catch (error) {
        return structuredClone(initialData);
    }
}

let data = loadData();

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getInitials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(part => part[0].toUpperCase()).join("");
}

function formatDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    return new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short" }).format(date);
}

// Devuelve la clave ISO de la semana: año-semana.
// La semana comienza el lunes.
function getISOWeekKey(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utcDate.getUTCDay() || 7;
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
    return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getMonday(date) {
    const copy = new Date(date);
    copy.setHours(12, 0, 0, 0);
    const day = (copy.getDay() + 6) % 7;
    copy.setDate(copy.getDate() - day);
    return copy;
}

function addDays(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
}

function dateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function completedWeekKeys() {
    return new Set(
        data.reservations
        .filter(reservation => reservation.status === "realizada")
        .map(reservation => getISOWeekKey(reservation.date))
    );
}

function calculateStreak() {
    const completedWeeks = completedWeekKeys();
    const currentWeek = getISOWeekKey(dateKey(new Date()));
    const previousWeek = getISOWeekKey(dateKey(addDays(getMonday(new Date()), -1)));

  // Si todavía no hay actividad esta semana, se conserva la racha
  // de la semana anterior mientras la semana actual siga en curso.
    let anchor = completedWeeks.has(currentWeek) ? currentWeek :
    (completedWeeks.has(previousWeek) ? previousWeek : null);

    if (!anchor) return 0;

    let streak = 0;
    let cursor = anchor;
    while (completedWeeks.has(cursor)) {
        streak++;
        cursor = previousISOWeek(cursor);
    }
    return streak;
}

function previousISOWeek(weekKey) {
    const [yearPart, weekPart] = weekKey.split("-W");
    const year = Number(yearPart);
    const week = Number(weekPart);
    if (week > 1) return `${year}-W${String(week - 1).padStart(2, "0")}`;
    const lastWeek = getISOWeekKey(`${year - 1}-12-31`);
    return lastWeek;
}

function renderProfile() {
    const { profile, role } = data;
    $("#welcomeName").textContent = profile.name.split(" ")[0];
    $("#profileName").textContent = profile.name;
    $("#profileEmail").textContent = profile.email;
    $("#profileRole").textContent = role === "deportista" ? "Deportista · Cuenta personal" : "Propietario · Administrador";
    $("#profileAvatar").textContent = getInitials(profile.name);
    $("#topAvatar").textContent = getInitials(profile.name);
    $("#detailName").textContent = profile.name;
    $("#detailEmail").textContent = profile.email;
    $("#detailCity").textContent = profile.city;
    $("#roleSelect").value = role;

    const isOwner = role === "propietario";
    $("#statOneLabel").textContent = isOwner ? "Reservas recibidas" : "Reservas realizadas";
    $("#statOne").textContent = isOwner
        ? data.reservations.filter(r => r.status !== "cancelada").length
        : data.reservations.filter(r => r.status === "realizada").length;
    $("#statThreeLabel").textContent = isOwner ? "Canchas registradas" : "Canchas favoritas";
    $("#statThree").textContent = isOwner ? data.courts.length : data.favorites.length;
    $("#sideTitle").textContent = isOwner ? "Datos del negocio" : "Mis datos";
    $("#quickTitle").textContent = isOwner ? "Mis espacios" : "Mis favoritos";
    $("#mainSectionTitle").textContent = isOwner ? "Reservas recibidas" : "Próximas reservas";
    $("#ownerPanel").classList.toggle("hidden", !isOwner);
    $("#addBookingBtn").textContent = isOwner ? "+ Añadir reserva de prueba" : "+ Nueva reserva";
    renderBookings();
    renderQuickList();
    renderCourts();
    renderStreak();
}

function renderBookings() {
    const list = $("#bookingList");
    const isOwner = data.role === "propietario";
    const reservations = [...data.reservations].sort((a, b) => a.date.localeCompare(b.date));
    const visible = isOwner ? reservations.filter(r => r.status !== "cancelada") :
        reservations.filter(r => r.status !== "realizada" && r.status !== "cancelada");

        if (!visible.length) {
    list.innerHTML = `<div class="empty-state">No tienes reservas próximas. ¡Puedes crear una nueva!</div>`;
    return;
    }

    list.innerHTML = visible.map(r => {
    const statusLabel = { confirmada: "Confirmada", pendiente: "Pendiente", realizada: "Realizada", cancelada: "Cancelada" }[r.status];
    const canComplete = r.status === "confirmada" || r.status === "pendiente";
    return `
        <article class="booking-card">
            <div class="booking-info">
            <h3>${escapeHTML(r.court)}</h3>
            <div class="booking-meta">
                <span>▣ ${formatDate(r.date)}</span>
                <span>◷ ${escapeHTML(r.time)}</span>
                <span>⚽ ${escapeHTML(r.sport)}</span>
            </div>
            </div>
            <div class="booking-actions">
            <span class="status ${r.status}">${statusLabel}</span>
            ${isOwner && canComplete ? `<button class="small-action" data-complete="${r.id}">Marcar realizada*</button>` : ""}
            </div>
        </article>`;
    }).join("");

  // Acción demostrativa: permite probar cómo una reserva completada suma a la racha.
    list.querySelectorAll("[data-complete]").forEach(button => {
        button.addEventListener("click", () => {
        const reservation = data.reservations.find(r => r.id === Number(button.dataset.complete));
        if (reservation) {
            reservation.status = "realizada";
            saveData();
            renderProfile();
        }
        });
    });
}

function renderQuickList() {
    const items = data.role === "propietario" ? data.courts : data.favorites;
    $("#quickList").innerHTML = items.length ? items.map(item => `
        <div class="quick-item">
        <div class="quick-thumb">⚽</div>
        <div><strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.type)}</span></div>
        </div>`).join("") : `<p class="muted">Todavía no hay elementos registrados.</p>`;
}

function renderCourts() {
    $("#courtList").innerHTML = data.courts.map(court => `
        <div class="court-item"><strong>${escapeHTML(court.name)}</strong><span>${escapeHTML(court.type)} · Espacio registrado</span></div>
    `).join("");
}

function renderStreak() {
    const streak = calculateStreak();
    $("#currentStreak").textContent = streak;
    $("#streakBig").textContent = streak;
    $("#streakMessage").textContent = streak > 0
        ? `¡Muy bien! Llevas ${streak} semana${streak === 1 ? "" : "s"} consecutiva${streak === 1 ? "" : "s"} con reservas completadas.`
        : "Aún no tienes una racha activa. Completa una reserva esta semana para comenzar.";

    const weeks = [];
    const mondayThisWeek = getMonday(new Date());
    for (let offset = 3; offset >= 0; offset--) {
        const monday = addDays(mondayThisWeek, -7 * offset);
        const key = getISOWeekKey(dateKey(monday));
        const active = completedWeekKeys().has(key);
        weeks.push({ label: offset === 0 ? "Esta semana" : `Hace ${offset} sem.`, active });
    }

    $("#weekTrack").innerHTML = weeks.map(week => `
        <div class="week-item ${week.active ? "done" : ""}">
        <strong>${week.active ? "✓ " : ""}${week.label}</strong>
        <span>${week.active ? "Reserva completada" : "Sin actividad"}</span>
        </div>`).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
}

// Cambiar modalidad.
$("#roleSelect").addEventListener("change", event => {
    data.role = event.target.value;
    saveData();
    renderProfile();
});

// Abrir edición del perfil.
function openProfileDialog() {
    $("#nameInput").value = data.profile.name;
    $("#emailInput").value = data.profile.email;
    $("#cityInput").value = data.profile.city;
    $("#profileDialog").showModal();
}
    $("#editProfileBtn").addEventListener("click", openProfileDialog);
    $("#sideEditBtn").addEventListener("click", openProfileDialog);
    $("#topAvatar").addEventListener("click", openProfileDialog);

    $("#profileForm").addEventListener("submit", event => {
    event.preventDefault();
    const nuevoNombre = $("#nameInput").value.trim();
    const nuevoCorreo = $("#emailInput").value.trim().toLowerCase();
    const nuevaCiudad = $("#cityInput").value.trim();

    data.profile.name = nuevoNombre;
    data.profile.email = nuevoCorreo;
    data.profile.city = nuevaCiudad;
    saveData();

    // Actualizar sesión activa y lista global de usuarios
    sesionActiva.nombre = nuevoNombre;
    sesionActiva.correo = nuevoCorreo;
    sesionActiva.ciudad = nuevaCiudad;
    localStorage.setItem("usuarioActivo", JSON.stringify(sesionActiva));
    localStorage.setItem("usuarioMiCancha", JSON.stringify(sesionActiva));

    // cerrar sesion (aun no funciona)
    const logoutBtn = document.getElementById("logoutBtn");

        if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("usuarioActivo");
            localStorage.removeItem("usuarioMiCancha");
            window.location.href = "inicio_sesion.html";
        });
    }


    const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados") || "[]");
    const idx = usuarios.findIndex(u => u.id === sesionActiva.id);
    if (idx !== -1) {
        usuarios[idx] = { ...usuarios[idx], nombre: nuevoNombre, correo: nuevoCorreo, ciudad: nuevaCiudad };
        localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    }

    $("#profileDialog").close();
    renderProfile();
});

// Crear una reserva.
    $("#addBookingBtn").addEventListener("click", () => {
    $("#bookingForm").reset();
    $("#dateInput").min = dateKey(new Date());
    $("#dateInput").value = dateInDays(2);
    $("#bookingDialog").showModal();
});

    $("#bookingForm").addEventListener("submit", event => {
    event.preventDefault();
    const newReservation = {
        id: Date.now(),
        court: $("#courtInput").value.trim(),
        date: $("#dateInput").value,
        time: $("#timeInput").value,
        sport: $("#sportInput").value,
        status: "pendiente"
    };
    data.reservations.push(newReservation);
    saveData();
    $("#bookingDialog").close();
    renderProfile();
    });

// Registrar cancha en la vista de propietario.
    $("#addCourtBtn").addEventListener("click", () => $("#courtDialog").showModal());
    $("#courtForm").addEventListener("submit", event => {
    event.preventDefault();
    data.courts.push({
        name: $("#newCourtName").value.trim(),
        type: $("#newCourtType").value.trim()
    });
    saveData();
    $("#courtDialog").close();
    $("#courtForm").reset();
    renderProfile();
    });

    $("#year").textContent = new Date().getFullYear();
    renderProfile();
