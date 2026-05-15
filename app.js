// ============================================================
// app.js  — Eternal Beauty Studio
// Toda la lógica del sitio público (index.html)
// ============================================================

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, addDoc, getDocs, query, where, Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─── DATOS ───────────────────────────────────────────────────
const SERVICES = [
  { id: 1, name: "Corte completo",      category: "corte",
    img: "https://www.shutterstock.com/image-photo/salon-job-hair-stylist-braids-260nw-2317955141.jpg",
    price: "$65",  duration: "90 min",
    description: "Corte personalizado según tu forma de rostro y tipo de cabello. Incluye lavado, tratamiento hidratante y peinado final profesional." },
  { id: 2, name: "Keratina",            category: "tratamientos",
    img: "https://directoriotierrasaltas.com/wp-content/uploads/2020/06/directorio-tierras-altas-keratinas-eva4-1200x1200.jpg",
    price: "$120", duration: "120 min",
    description: "Alisado semipermanente que elimina el frizz y da brillo intenso. Resultados que duran hasta 4 meses. Libre de formaldehído." },
  { id: 3, name: "Pedicura Spa",        category: "uñas",
    img: "https://www.telebelleza.es/img/cms/manicura_pedicura_pagina.jpg",
    price: "$55",  duration: "75 min",
    description: "Limpieza profunda, exfoliación, masaje relajante y esmaltado. Tus pies merecen el mejor cuidado." },
  { id: 4, name: "Hidratación Facial",  category: "faciales",
    img: "https://lulabeauty.co/cdn/shop/files/Complementarias_lapices_cejas_Mesa_de_trabajo_1_copia_16.jpg",
    price: "$70",  duration: "60 min",
    description: "Tratamiento de hidratación profunda con ácido hialurónico y activos botánicos. Efecto luminoso inmediato." },
  { id: 5, name: "Manicura Gel",        category: "uñas",
    img: "https://media.glamour.mx/photos/61f055d8e95d4d02a8681c4f/16:9/w_2256,h_1269,c_limit/disen%CC%83osdeun%CC%83asblancoynegro.jpg",
    price: "$35",  duration: "45 min",
    description: "Manicura con esmalte gel de larga duración. Hasta 3 semanas sin astillas. Acabado salon-perfect." },
  { id: 6, name: "Tinte de pelo",       category: "tratamientos",
    img: "https://img.freepik.com/foto-gratis/mujer-lavando-su-cabello-salon-belleza_23-2149167387.jpg",
    price: "$180", duration: "150 min",
    description: "Color profesional con técnicas de balayage, mechas o tinte uniforme. Incluye tratamiento de brillo post-color." },
  { id: 7, name: "Puntas & Capas",      category: "corte",
    img: "https://e00-telva.uecdn.es/assets/multimedia/imagenes/2020/01/28/15802411454678.jpg",
    price: "$50",  duration: "60 min",
    description: "Eliminación de puntas abiertas y capas que dan movimiento y volumen natural a tu cabello." },
  { id: 8, name: "Pedicura Premium",    category: "tratamientos",
    img: "https://inesbe.com/wp-content/smush-webp/2024/04/woman-enjoying-pedicure-spa-treatment-at-a-beauty-2023-11-27-05-24-21-utc-1-1-1024x683.jpg.webp",
    price: "$90",  duration: "90 min",
    description: "Experiencia spa completa: baño de pies, masaje con aromaterapia, exfoliación y esmaltado premium." }
];

const CATEGORIES = [
  { id: "all",          label: "Todos" },
  { id: "corte",        label: "Corte" },
  { id: "faciales",     label: "Faciales" },
  { id: "uñas",         label: "Uñas" },
  { id: "tratamientos", label: "Tratamientos" }
];


let currentFilter = "all";

// ════════════════════════════════════════
// FILTROS DE SERVICIOS
// ════════════════════════════════════════
function renderFilters() {
  const el = document.getElementById("filters");
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c =>
    `<button class="filter-btn ${c.id === "all" ? "active" : ""}" data-cat="${c.id}">${c.label}</button>`
  ).join("");
  el.querySelectorAll(".filter-btn").forEach(btn =>
    btn.addEventListener("click", () => setFilter(btn.dataset.cat))
  );
}

function setFilter(cat) {
  currentFilter = cat;
  document.querySelectorAll(".filter-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.cat === cat)
  );
  renderServices();
}

// ════════════════════════════════════════
// GRID DE SERVICIOS
// ════════════════════════════════════════
function renderServices() {
  const grid = document.getElementById("servicesGrid");
  if (!grid) return;
  const list = currentFilter === "all"
    ? SERVICES
    : SERVICES.filter(s => s.category === currentFilter);

  grid.innerHTML = list.map((s, i) => `
    <article class="service-card" data-id="${s.id}" style="transition-delay:${i * 0.07}s">
      <div class="card-visual">
        <img src="${s.img}" class="card-img" alt="${s.name}" loading="lazy">
        <span class="card-category-tag">${s.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${s.name}</h3>
        <p class="card-desc">${s.description.slice(0, 82)}…</p>
        <div class="card-footer">
          <span class="card-price">${s.price}</span>
          <button class="card-btn" aria-label="Ver detalle de ${s.name}">Ver detalle →</button>
        </div>
      </div>
    </article>
  `).join("");

  requestAnimationFrame(() => {
    grid.querySelectorAll(".service-card").forEach((c, i) =>
      setTimeout(() => c.classList.add("visible"), i * 80)
    );
  });

  grid.querySelectorAll(".service-card").forEach(card =>
    card.addEventListener("click", () => openDetail(+card.dataset.id))
  );

  populateSelect();
}

// ════════════════════════════════════════
// DETALLE DE SERVICIO
// ════════════════════════════════════════
function openDetail(id) {
  const s = SERVICES.find(x => x.id === id);
  if (!s) return;
  document.getElementById("detailImg").src            = s.img;
  document.getElementById("detailImg").alt            = s.name;
  document.getElementById("detailTag").textContent    = `${s.category} · ${s.duration}`;
  document.getElementById("detailName").textContent   = s.name;
  document.getElementById("detailDesc").textContent   = s.description;
  document.getElementById("detailPrice").textContent  = s.price;
  document.getElementById("detailOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDetailDirect() {
  document.getElementById("detailOverlay").classList.remove("open");
  document.body.style.overflow = "";
}
window.closeDetailDirect = closeDetailDirect;

// Cerrar al hacer clic en el fondo
document.getElementById("detailOverlay")?.addEventListener("click", e => {
  if (e.target === document.getElementById("detailOverlay")) closeDetailDirect();
});

// Reservar desde el detalle
window.reservarServicio = function () {
  const servicio = document.getElementById("detailName").textContent;
  closeDetailDirect();
  document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    const sel = document.getElementById("fservice");
    if (sel) sel.value = servicio;
  }, 600);
};

// ════════════════════════════════════════
// WHATSAPP
// ════════════════════════════════════════
window.openWhatsApp = function (msg) {
  const text = msg || "Hola! Me gustaría reservar una cita en Eternal Beauty Studio.";
  window.open(`https://wa.me/50765991047?text=${encodeURIComponent(text)}`, "_blank");
};

// ════════════════════════════════════════
// SELECT DE SERVICIOS EN EL FORMULARIO
// ════════════════════════════════════════
function populateSelect() {
  const sel = document.getElementById("fservice");
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">Selecciona un servicio</option>' +
    SERVICES.map(s =>
      `<option value="${s.name}" ${s.name === cur ? "selected" : ""}>${s.name} — ${s.price}</option>`
    ).join("");
}

// ════════════════════════════════════════
// HORAS DISPONIBLES (desde Firestore)
// ════════════════════════════════════════
async function generarHoras() {
  const sel   = document.getElementById("fhour");
  const fecha = document.getElementById("fdate")?.value || "";
  if (!sel) return;

  sel.innerHTML = '<option value="">Cargando horas…</option>';
  sel.disabled = true;

  let ocupadas = [];
  if (fecha) {
    try {
      const snap = await getDocs(
        query(
          collection(db, "reservas"),
          where("fecha", "==", fecha),
          where("estado", "in", ["pendiente", "confirmada"])
        )
      );
      ocupadas = snap.docs.map(d => d.data().hora).filter(Boolean);
    } catch (err) {
      console.warn("Error al cargar horas:", err.message);
    }
  }

  sel.disabled = false;
  let html = '<option value="">Selecciona una hora</option>';
  for (let h = 9; h <= 18; h++) {
    const hora = `${String(h).padStart(2, "0")}:00`;
    const busy = ocupadas.includes(hora);
    html += `<option value="${hora}" ${busy ? "disabled" : ""}>${hora}${busy ? " (ocupado)" : ""}</option>`;
  }
  sel.innerHTML = html;
}

document.getElementById("fdate")?.addEventListener("change", generarHoras);

// ════════════════════════════════════════
// FORMULARIO → FIRESTORE + WHATSAPP
// ════════════════════════════════════════
async function submitForm() {
  const btn  = document.getElementById("submitBtn");
  if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

  const name    = document.getElementById("fname")?.value.trim()   || "";
  const phone   = document.getElementById("fphone")?.value.trim()  || "";
  const service = document.getElementById("fservice")?.value       || "";
  const date    = document.getElementById("fdate")?.value          || "";
  const hour    = document.getElementById("fhour")?.value          || "";
  const msg     = document.getElementById("fmsg")?.value.trim()    || "";

  // Limpiar errores anteriores
  document.querySelectorAll(".form-error").forEach(e => e.classList.remove("show"));

  let valid = true;
  if (!name)              { document.getElementById("fname-error").classList.add("show");    valid = false; }
  if (!phone || phone.length < 6) { document.getElementById("fphone-error").classList.add("show");   valid = false; }
  if (!service)           { document.getElementById("fservice-error").classList.add("show"); valid = false; }

  if (!valid) {
    if (btn) { btn.disabled = false; btn.textContent = "Enviar solicitud"; }
    return;
  }

  // Guardar en Firestore
  try {
    await addDoc(collection(db, "reservas"), {
      nombre:   name,
      telefono: phone,
      servicio: service,
      fecha:    date,
      hora:     hour,
      mensaje:  msg,
      estado:   "pendiente",
      creadoEn: Timestamp.now()
    });
  } catch (err) {
    console.warn("Firestore:", err.message);
  }

  // Abrir WhatsApp
  const waMsg = `Hola, quiero reservar una cita:\n\n👤 Nombre: ${name}\n📱 Teléfono: ${phone}\n✂️ Servicio: ${service}\n📅 Fecha: ${date || "No especificada"}\n🕐 Hora: ${hour || "No especificada"}\n💬 Mensaje: ${msg || "Ninguno"}`;
  window.open(`https://wa.me/50765991047?text=${encodeURIComponent(waMsg)}`, "_blank");

  // Resetear formulario
  ["fname", "fphone", "fservice", "fdate", "fhour", "fmsg"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  generarHoras();

  // Mostrar mensaje de éxito
  const ok = document.getElementById("successMsg");
  if (ok) {
    ok.classList.add("show");
    setTimeout(() => ok.classList.remove("show"), 5000);
  }

  if (btn) { btn.disabled = false; btn.textContent = "Enviar solicitud"; }
}
window.submitForm = submitForm;

// ════════════════════════════════════════
// ANIMACIONES AL HACER SCROLL
// ════════════════════════════════════════
function initScrollAnimations() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".fade-up, .gallery-item").forEach(el => io.observe(el));
}

// ════════════════════════════════════════
// HAMBURGER (MÓVIL)
// ════════════════════════════════════════
window.toggleMobileNav = function () {
  document.getElementById("mobileNav")?.classList.toggle("open");
  document.getElementById("hamburger")?.classList.toggle("open");
  document.getElementById("mobileNavOverlay")?.classList.toggle("open");
  document.body.style.overflow = document.getElementById("mobileNav")?.classList.contains("open") ? "hidden" : "";
};
window.closeMobileNav = function () {
  document.getElementById("mobileNav")?.classList.remove("open");
  document.getElementById("hamburger")?.classList.remove("open");
  document.getElementById("mobileNavOverlay")?.classList.remove("open");
  document.body.style.overflow = "";
};

// ════════════════════════════════════════
// NAV SCROLL
// ════════════════════════════════════════
window.addEventListener("scroll", () => {
  document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 40);
});

// ════════════════════════════════════════
// GALERÍA SCROLL
// ════════════════════════════════════════
window.scrollGallery = function (dir) {
  const c = document.getElementById("gallery");
  if (!c) return;
  const max = c.scrollWidth - c.clientWidth;
  if      (dir ===  1 && c.scrollLeft >= max - 10) c.scrollTo({ left: 0,   behavior: "smooth" });
  else if (dir === -1 && c.scrollLeft <= 0)         c.scrollTo({ left: max, behavior: "smooth" });
  else    c.scrollBy({ left: dir * 300, behavior: "smooth" });
};

// ════════════════════════════════════════
// MODAL DE IMAGEN
// ════════════════════════════════════════
window.openModal  = src => { document.getElementById("modalImg").src = src; document.getElementById("imageModal").classList.add("show"); };
window.closeModal = ()  => document.getElementById("imageModal")?.classList.remove("show");

// ════════════════════════════════════════
// BEFORE / AFTER SLIDER
// ════════════════════════════════════════
function initSlider(containerId, afterWrapId, dividerId, handleId) {
  const container = document.getElementById(containerId);
  const afterWrap = document.getElementById(afterWrapId);
  const divider   = document.getElementById(dividerId);
  const handle    = document.getElementById(handleId);
  if (!container || !handle) return;

  let dragging = false;

  function setPos(clientX) {
    const rect = container.getBoundingClientRect();
    afterWrap.querySelector("img").style.width = rect.width + "px";
    const pct = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1)) * 100;
    afterWrap.style.width  = `${pct}%`;
    divider.style.left     = `${pct}%`;
    handle.style.left      = `calc(${pct}% - 0px)`;
  }

  handle.addEventListener("mousedown",  e => { e.preventDefault(); dragging = true;  container.classList.add("dragging"); });
  handle.addEventListener("touchstart", ()  => { dragging = true;  container.classList.add("dragging"); }, { passive: true });
  window.addEventListener("mousemove",  e   => { if (dragging) setPos(e.clientX); });
  window.addEventListener("touchmove",  e   => { if (dragging) { e.preventDefault(); setPos(e.touches[0].clientX); } }, { passive: false });
  ["mouseup", "touchend", "touchcancel"].forEach(ev =>
    window.addEventListener(ev, () => { dragging = false; container.classList.remove("dragging"); })
  );
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  renderServices();
  generarHoras();
  initScrollAnimations();
  initSlider("ba1", "afterWrap1", "baDivider1", "baHandle1");
  initSlider("ba2", "afterWrap2", "baDivider2", "baHandle2");

  document.getElementById("submitBtn")?.addEventListener("click", submitForm);

  if (window.lucide) lucide.createIcons();

  // ── Login modal ──────────────────────────────────────────
  const loginModal = document.getElementById("loginModal");
  if (loginModal) {
    // Cerrar al hacer clic en el fondo
    loginModal.addEventListener("click", e => {
      if (e.target === loginModal) loginModal.classList.remove("open");
    });
    // Cerrar con Escape
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") loginModal.classList.remove("open");
    });
    // Enter en el campo contraseña
    document.getElementById("loginPassword")?.addEventListener("keydown", e => {
      if (e.key === "Enter") handleAdminLogin();
    });
  }
});

// ════════════════════════════════════════
// LOGIN ADMIN
// ════════════════════════════════════════
const AUTH_ERRORS = {
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/user-not-found":     "No existe una cuenta con ese correo.",
  "auth/wrong-password":     "Contraseña incorrecta.",
  "auth/invalid-email":      "El correo no es válido.",
  "auth/too-many-requests":  "Demasiados intentos. Intenta más tarde.",
  "auth/popup-closed-by-user": "Cerraste el popup antes de completar el login."
};

function setLoginLoading(loading, btnId = "loginBtn", text = "Iniciar sesión") {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? "Entrando…" : text;
}

function showLoginError(msg) {
  const errEl = document.getElementById("loginError");
  if (!errEl) return;
  errEl.textContent = msg;
  errEl.style.display = "block";
}

function clearLoginError() {
  const errEl = document.getElementById("loginError");
  if (errEl) errEl.style.display = "none";
}

window.toggleLoginPassword = function () {
  const input = document.getElementById("loginPassword");
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
};

window.handleGoogleLogin = async function () {
  clearLoginError();
  const btn = document.getElementById("loginGoogleBtn");
  if (btn) { btn.disabled = true; btn.textContent = "Conectando…"; }
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    window.location.href = "admin.html";
  } catch (err) {
    showLoginError(AUTH_ERRORS[err.code] || "Error al iniciar sesión con Google.");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20"> Continuar con Google';
    }
  }
};

window.handleAdminLogin = async function () {
  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  clearLoginError();
  setLoginLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html";
  } catch (err) {
    showLoginError(AUTH_ERRORS[err.code] || "Error al iniciar sesión.");
    setLoginLoading(false);
  }
};

