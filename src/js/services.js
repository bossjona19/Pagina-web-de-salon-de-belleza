// services.js — Datos de servicios, filtros y grid de tarjetas
//
// IMÁGENES PENDIENTES: reemplazar cada `img` con ruta local /src/assets/img/services/<nombre>.jpg
// Tamaño recomendado: 600×400 px, formato WebP, < 80 KB por imagen.
// Mientras tanto, los errores de carga se manejan con opacidad 0 (fondo beige visible).

export const SERVICES = [
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

export const CATEGORIES = [
  { id: "all",          label: "Todos" },
  { id: "corte",        label: "Corte" },
  { id: "faciales",     label: "Faciales" },
  { id: "uñas",         label: "Uñas" },
  { id: "tratamientos", label: "Tratamientos" }
];

let currentFilter = "all";

export function getDuracion(nombreServicio) {
  const s = SERVICES.find(x => x.name === nombreServicio);
  return s ? (parseInt(s.duration) || 60) : 60;
}

export function populateSelect() {
  const sel = document.getElementById("fservice");
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">Selecciona un servicio</option>' +
    SERVICES.map(s =>
      `<option value="${s.name}" ${s.name === cur ? "selected" : ""}>${s.name} — ${s.price}</option>`
    ).join("");
}

export function renderFilters() {
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

export function renderServices() {
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

  grid.querySelectorAll(".card-img").forEach(img =>
    img.addEventListener("error", () => { img.style.opacity = "0"; }, { once: true })
  );

  populateSelect();
}

function openDetail(id) {
  const s = SERVICES.find(x => x.id === id);
  if (!s) return;
  const detailImg = document.getElementById("detailImg");
  detailImg.style.opacity = "1";
  detailImg.onerror = () => { detailImg.style.opacity = "0"; };
  detailImg.src = s.img;
  detailImg.alt = s.name;
  document.getElementById("detailTag").textContent   = `${s.category} · ${s.duration}`;
  document.getElementById("detailName").textContent  = s.name;
  document.getElementById("detailDesc").textContent  = s.description;
  document.getElementById("detailPrice").textContent = s.price;
  document.getElementById("detailOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDetailDirect() {
  document.getElementById("detailOverlay").classList.remove("open");
  document.body.style.overflow = "";
}
window.closeDetailDirect = closeDetailDirect;

document.getElementById("detailOverlay")?.addEventListener("click", e => {
  if (e.target === document.getElementById("detailOverlay")) closeDetailDirect();
});

window.reservarServicio = function () {
  const servicio = document.getElementById("detailName").textContent;
  closeDetailDirect();
  document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    const sel = document.getElementById("fservice");
    if (sel) sel.value = servicio;
  }, 600);
};

window.openWhatsApp = function (msg) {
  const text = msg || "Hola! Me gustaría reservar una cita en Eternal Beauty Studio.";
  window.open(`https://wa.me/50765991047?text=${encodeURIComponent(text)}`, "_blank");
};
