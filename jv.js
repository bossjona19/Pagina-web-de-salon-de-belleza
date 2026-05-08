const SERVICES = [
  { id: 1, name: "Corte de pelo completo", category: "corte", img: "https://www.shutterstock.com/image-photo/salon-job-hair-stylist-braids-260nw-2317955141.jpg", price: "$65", description: "Maquillaje profesional para eventos sociales, graduaciones, cumpleaños o cualquier ocasión especial. Incluye preparación de piel, corrección de color y acabado duradero de larga duración.", duration: "90 min" },
  { id: 2, name: "Keratina", category: "tratamientos", img: "https://directoriotierrasaltas.com/wp-content/uploads/2020/06/directorio-tierras-altas-keratinas-eva4-1200x1200.jpg", price: "$120", description: "El gran día merece perfección absoluta. Prueba previa incluida, maquillaje a prueba de agua y lagrimas, fijador profesional y acompañamiento en fotos. Disponible con prueba anticipada.", duration: "120 min" },
  { id: 3, name: "Pediquir", category: "uñas", img: "https://www.telebelleza.es/img/cms/manicura_pedicura_pagina.jpg", price: "$55", description: "Limpieza profunda de poros, extracción controlada de impurezas, exfoliación y mascarilla personalizada según tu tipo de piel. Resultados visibles desde la primera sesión.", duration: "75 min" },
  { id: 4, name: "Hidratación Intensiva", category: "faciales", img: "https://lulabeauty.co/cdn/shop/files/Complementarias_lapices_cejas_Mesa_de_trabajo_1_copia_16.jpg?crop=center&height=2250&v=1753132958&width=2250", price: "$70", description: "Tratamiento de hidratación profunda con ácido hialurónico y activos botánicos. Ideal para piel seca, cansada o con signos de deshidratación. Efecto luminoso inmediato.", duration: "60 min" },
  { id: 5, name: "pediquier", category: "uñas",img: "https://media.glamour.mx/photos/61f055d8e95d4d02a8681c4f/16:9/w_2256,h_1269,c_limit/disen%CC%83osdeun%CC%83asblancoynegro.jpg", price: "$35", description: "Definición y armonización de cejas según tu morfología facial. Incluye depilación con hilo, diseño personalizado y tinte opcional para mayor definición y duración.", duration: "45 min" },
  { id: 6, name: "Tinte de pelo", category: "tratamientos", img: "https://img.freepik.com/foto-gratis/mujer-lavando-su-cabello-salon-belleza_23-2149167387.jpg?semt=ais_hybrid&w=740&q=80", price: "$180", description: "Técnica semipermanente de diseño de cejas con trazos naturales que imitan el vello. Resultados que duran entre 12 y 18 meses. Incluye sesión de retoque a los 30 días.", duration: "150 min" },
  { id: 7, name: "Corte en las puntas", category: "corte", img: "https://e00-telva.uecdn.es/assets/multimedia/imagenes/2020/01/28/15802411454678.jpg", price: "$50", description: "Curvado permanente y tinte de pestañas naturales. Sin extensiones, sin pegamentos. Resultado hasta 8 semanas. Efecto open eye que realza la mirada sin mantenimiento diario.", duration: "60 min" },
  { id: 8, name: "Lavado de pie", category: "tratamientos", img: "https://inesbe.com/wp-content/smush-webp/2024/04/woman-enjoying-pedicure-spa-treatment-at-a-beauty-2023-11-27-05-24-21-utc-1-1-1024x683.jpg.webp", price: "$90", description: "Protocolo de rejuvenecimiento facial con vitamina C, retinol y técnicas de masaje reafirmante. Combate líneas de expresión y mejora la firmeza y luminosidad de la piel.", duration: "90 min" }
  ];

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "corte", label: "Corte" },
  { id: "faciales", label: "Faciales" },
  { id: "uñas", label: "Uñas" },
  { id: "tratamientos", label: "Tratamientos" }
];

let currentFilter = "all";

function renderFilters() {
  const el = document.getElementById("filters");
  el.innerHTML = CATEGORIES.map(c =>
    `<button class="filter-btn ${c.id === "all" ? "active" : ""}" data-cat="${c.id}" onclick="setFilter('${c.id}')">${c.label}</button>`
  ).join("");
}

function setFilter(cat) {
  currentFilter = cat;
  document.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === cat);
  });
  renderServices();
}

function renderServices() {
  const grid = document.getElementById("servicesGrid");
  const filtered = currentFilter === "all" ? SERVICES : SERVICES.filter(s => s.category === currentFilter);
  grid.innerHTML = filtered.map((s, i) => `
    <article class="service-card" style="transition-delay: ${i * 0.08}s" onclick="openDetail(${s.id})">
      <div class="card-visual">
        <img src="${s.img}" class="card-img">
        <span class="card-category-tag">${s.category}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${s.name}</h3>
        <p class="card-desc">${s.description.substring(0, 80)}...</p>
        <div class="card-footer">
          <span class="card-price">${s.price}</span>
          <button class="card-btn">Ver detalle →</button>
        </div>
      </div>
    </article>
  `).join("");
  setTimeout(() => {
    grid.querySelectorAll(".service-card").forEach((c, i) => {
      setTimeout(() => c.classList.add("visible"), i * 80);
    });
  }, 50);

  populateSelect();
}

function populateSelect() {
  const sel = document.getElementById("fservice");
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">Selecciona un servicio</option>' +
    SERVICES.map(s => `<option value="${s.name}" ${s.name === cur ? "selected" : ""}>${s.name} — ${s.price}</option>`).join("");
}

function openDetail(id) {
  const s = SERVICES.find(x => x.id === id);
  if (!s) return;
  document.getElementById("detailImg").src = s.img;
  document.getElementById("detailTag").textContent = s.category + " · " + s.duration;
  document.getElementById("detailName").textContent = s.name;
  document.getElementById("detailDesc").textContent = s.description;
  document.getElementById("detailPrice").textContent = s.price;
  document.getElementById("detailOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDetail(e) {
  if (e.target === document.getElementById("detailOverlay")) closeDetailDirect();
}

function closeDetailDirect() {
  document.getElementById("detailOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openWhatsApp() {
  const msg = encodeURIComponent("Hola! Me gustaría reservar una cita en Eternal Beauty Studio.");
  window.open("https://wa.me/65991947?text=" + msg, "_blank");
}

function submitForm() {
  const name = document.getElementById("fname").value.trim();
  const phone = document.getElementById("fphone").value.trim();
  const service = document.getElementById("fservice").value;
  const date = document.getElementById("fdate").value;
  const hour = document.getElementById("fhour").value; // ✅ CORREGIDO
  const msg = document.getElementById("fmsg") ? document.getElementById("fmsg").value.trim() : "";

  let valid = true;

  document.querySelectorAll(".form-error").forEach(e => e.classList.remove("show"));

  if (!name) { document.getElementById("fname-error").classList.add("show"); valid = false; }
  if (!phone || phone.length < 6) { document.getElementById("fphone-error").classList.add("show"); valid = false; }
  if (!service) { document.getElementById("fservice-error").classList.add("show"); valid = false; }

  if (valid) {

    const mensaje = encodeURIComponent(
`Hola, quiero reservar una cita:

Nombre: ${name}
Teléfono: ${phone}
Servicio: ${service}
Fecha: ${date || "No especificada"}
Hora: ${hour || "No especificada"}
Mensaje: ${msg || "Ninguno"}`
    );

    window.open(`https://wa.me/50765991047?text=${mensaje}`, "_blank");

    // limpiar
    document.getElementById("fname").value = "";
    document.getElementById("fphone").value = "";
    document.getElementById("fservice").value = "";
    document.getElementById("fdate").value = "";
    document.getElementById("fhour").value = "";

    if (document.getElementById("fmsg")) {
      document.getElementById("fmsg").value = "";
    }

    document.getElementById("successMsg").classList.add("show");
    setTimeout(() => document.getElementById("successMsg").classList.remove("show"), 5000);
  }
}
function initScrollAnimations() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".fade-up, .gallery-item").forEach(el => io.observe(el));
}

renderFilters();
renderServices();
document.addEventListener("DOMContentLoaded", initScrollAnimations);
setTimeout(initScrollAnimations, 100);
function reservarServicio() {
  // 1. Obtener el nombre del servicio que estás viendo
  const servicio = document.getElementById("detailName").textContent;

  // 2. Cerrar el modal
  closeDetailDirect();

  // 3. Bajar a la sección contacto
  document.querySelector("#contacto").scrollIntoView({
    behavior: "smooth"
  });

  // 4. Seleccionar automáticamente el servicio en el select
  setTimeout(() => {
    const select = document.getElementById("fservice");
    if (select) {
      select.value = servicio;
    }
  }, 500);
}
// HAMBURGER MENU
function toggleMobileNav() {
  const nav = document.getElementById("mobileNav");
  const btn = document.getElementById("hamburger");
  nav.classList.toggle("open");
  btn.classList.toggle("open");
}

function closeMobileNav() {
  document.getElementById("mobileNav").classList.remove("open");
  document.getElementById("hamburger").classList.remove("open");
}

// NAV SCROLL EFFECT
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// SCROLL CON LOOP
function scrollGallery(direction) {
  const container = document.getElementById("gallery");

  const maxScroll = container.scrollWidth - container.clientWidth;

  if (direction === 1 && container.scrollLeft >= maxScroll - 10) {
    container.scrollTo({ left: 0, behavior: "smooth" });
  } else if (direction === -1 && container.scrollLeft <= 0) {
    container.scrollTo({ left: maxScroll, behavior: "smooth" });
  } else {
    container.scrollBy({
      left: direction * 300,
      behavior: "smooth"
    });
  }
}

// ABRIR IMAGEN
function openModal(src) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("modalImg");

  img.src = src;
  modal.classList.add("show");
}

// CERRAR
function closeModal() {
  document.getElementById("imageModal").classList.remove("show");
}
// -----------------------------------------------------------
// BEFORE / AFTER — solo el handle arrastra, no toda la imagen
function initSlider(containerId, afterWrapId, dividerId, handleId) {
  const container = document.getElementById(containerId);
  const afterWrap  = document.getElementById(afterWrapId);
  const divider    = document.getElementById(dividerId);
  const handle     = document.getElementById(handleId);

  if (!container || !handle) return;

  let dragging = false;

  function setPos(clientX) {
    const rect = container.getBoundingClientRect();
    afterWrap.querySelector("img").style.width = rect.width + "px";
    let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const pct = (x / rect.width) * 100;
    afterWrap.style.width = pct + "%";
    divider.style.left    = pct + "%";
    handle.style.left     = pct + "%";
  }

  // — Solo el HANDLE inicia el drag
  handle.addEventListener("mousedown", e => {
    e.preventDefault();
    dragging = true;
    container.classList.add("dragging");
  });

  handle.addEventListener("touchstart", e => {
    dragging = true;
    container.classList.add("dragging");
  }, { passive: true });

  // — El movimiento se escucha en window para no perderlo
  window.addEventListener("mousemove", e => {
    if (!dragging) return;
    setPos(e.clientX);
  });

  window.addEventListener("touchmove", e => {
    if (!dragging) return;
    e.preventDefault();
    setPos(e.touches[0].clientX);
  }, { passive: false });

  // — Soltar en cualquier parte
  window.addEventListener("mouseup",    () => { dragging = false; container.classList.remove("dragging"); });
  window.addEventListener("touchend",   () => { dragging = false; container.classList.remove("dragging"); });
  window.addEventListener("touchcancel",() => { dragging = false; container.classList.remove("dragging"); });
}

initSlider("ba1", "afterWrap1", "baDivider1", "baHandle1");
initSlider("ba2", "afterWrap2", "baDivider2", "baHandle2");
//---------------------------------
const HORAS_OCUPADAS = {
  "2026-05-19": ["13:00", "16:00"],
  "2026-05-20": ["10:00", "15:00"]
};

function generarHoras() {
  const select = document.getElementById("fhour");
  const fecha = document.getElementById("fdate").value;

  select.innerHTML = '<option value="">Selecciona una hora</option>';

  for (let h = 9; h <= 18; h++) {
    const hora = `${h}:00`;

    // Verificar si está ocupada
    const ocupadas = HORAS_OCUPADAS[fecha] || [];
    const estaOcupada = ocupadas.includes(hora);

    select.innerHTML += `
      <option value="${hora}" ${estaOcupada ? "disabled" : ""}>
        ${hora} ${estaOcupada ? "(ocupado)" : ""}
      </option>
    `;
  }
}
document.getElementById("fdate").addEventListener("change", generarHoras);

// Ejecutar al inicio
generarHoras();