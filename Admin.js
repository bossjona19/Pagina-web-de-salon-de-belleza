// ============================================================
// admin.js — Eternal Beauty Studio
// Panel administrativo: auth, Firestore, calendario, charts, Excel
// ============================================================

import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { addCalendarEvent, removeCalendarEvent } from "./calendar.js";

// ─── CONFIG — agrega aquí los correos de cada admin ──────────
const ADMIN_EMAILS = [
  "quinterojonathan108@gmail.com",
  // "duena@correo.com",
  // "asistente@correo.com",
];

// Precio estimado por servicio (para KPIs)
const SERVICE_PRICES = {
  "Corte completo":    65,
  "Keratina":         120,
  "Pedicura Spa":      55,
  "Hidratación Facial": 70,
  "Manicura Gel":      35,
  "Tinte de pelo":    180,
  "Puntas & Capas":    50,
  "Pedicura Premium":  90
};

// ─── STATE ───────────────────────────────────────────────────
let allReservations = [];
let currentTableFilter = "todas";
let calCurrentYear  = new Date().getFullYear();
let calCurrentMonth = new Date().getMonth(); // 0-based
let revenueChartInst = null;
let servicesChartInst = null;
let statusChartInst  = null;
let monthlyChartInst = null;
let chartsRendered   = false;

// ─── HELPERS ─────────────────────────────────────────────────
function showToast(msg, duration = 3200) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

function hideLoading() {
  const s = document.getElementById("loadingScreen");
  if (s) {
    s.style.opacity = "0";
    setTimeout(() => s.remove(), 500);
  }
}

function getPrice(serviceName) {
  return SERVICE_PRICES[serviceName] || 0;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return dateStr;
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${d} ${months[parseInt(m)-1]} ${y}`;
}

function badgeHTML(estado) {
  const map = {
    pendiente:  ["badge-pendiente",  "⏳ Pendiente"],
    confirmada: ["badge-confirmada", "✅ Confirmada"],
    cancelada:  ["badge-cancelada",  "❌ Cancelada"],
    completada: ["badge-completada", "🌸 Completada"]
  };
  const [cls, label] = map[estado] || ["badge-pendiente","— Desconocido"];
  return `<span class="badge ${cls}">${label}</span>`;
}

function actionBtns(id, estado, telefono, nombre, servicio) {
  const tel = telefono ? encodeURIComponent(
    `Hola ${nombre}, tu cita de ${servicio} ha sido confirmada en Eternal Beauty Studio. ✨`
  ) : "";
  const waBtn = telefono
    ? `<button class="btn-action btn-act-wa" onclick="sendWA('${telefono}','${nombre}','${servicio}')">💬</button>`
    : "";

  const confirmBtn = estado === "pendiente"
    ? `<button class="btn-action btn-act-confirm" onclick="confirmReservation('${id}')">✔ Confirmar</button>`
    : "";

  return `
    <div class="action-btns">
      ${confirmBtn}
      <button class="btn-action btn-act-edit" onclick="openEditModal('${id}')">✏️</button>
      <button class="btn-action btn-act-delete" onclick="openDeleteModal('${id}')">🗑️</button>
      ${waBtn}
    </div>
  `;
}

// ─── AUTH GUARD ───────────────────────────────────────────────
onAuthStateChanged(auth, user => {
  window._cancelAuthTimer?.(); // cancela el timeout de seguridad
  if (!user) {
    hideLoading();
    window.location.href = "index.html";
    return;
  }
  if (!ADMIN_EMAILS.includes(user.email)) {
    hideLoading();
    document.body.innerHTML = `
      <div class="access-denied">
        <h1>Acceso denegado</h1>
        <p>La cuenta <strong>${user.email}</strong> no tiene permisos de administrador.</p>
        <a href="index.html" class="btn-primary" style="text-decoration:none;padding:14px 32px;border-radius:6px;">Volver al sitio</a>
      </div>`;
    return;
  }

  const emailEl  = document.getElementById("sidebarEmail");
  const avatarEl = document.getElementById("sidebarAvatar");
  if (emailEl)  emailEl.textContent = user.email;
  if (avatarEl) avatarEl.textContent = user.displayName?.[0]?.toUpperCase() || "A";

  initRealtimeListener();
  hideLoading();
});

// ─── LOGOUT ──────────────────────────────────────────────────
window.doLogout = async () => {
  await signOut(auth);
  location.href = "index.html";
};

// ─── REALTIME LISTENER ───────────────────────────────────────
function initRealtimeListener() {
  const q = query(collection(db, "reservas"), orderBy("creadoEn", "desc"));
  onSnapshot(q, snapshot => {
    allReservations = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    updateKPIs();
    renderRecentTable();
    renderFullTable();
    renderCalendar();
    if (chartsRendered) renderCharts();
  }, err => {
    console.error("Firestore error:", err);
    showToast("⚠️ Error al cargar los datos.");
  });

  // Expose render functions for tab switching
  window._adminCharts = { renderAll: renderCharts };
  window._adminCalendar = { render: renderCalendar };
}

// ─── KPIs ─────────────────────────────────────────────────────
function updateKPIs() {
  const total     = allReservations.length;
  const pending   = allReservations.filter(r => r.estado === "pendiente").length;
  const confirmed = allReservations.filter(r => r.estado === "confirmada").length;
  const revenue   = allReservations
    .filter(r => r.estado === "confirmada")
    .reduce((sum, r) => sum + getPrice(r.servicio), 0);

  safeSet("kpiTotal",     total);
  safeSet("kpiPending",   pending);
  safeSet("kpiConfirmed", confirmed);
  safeSet("kpiRevenue",   `$${revenue.toLocaleString()}`);
}

function safeSet(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ─── RECENT TABLE (dashboard, last 5) ────────────────────────
function renderRecentTable() {
  const tbody = document.getElementById("recentTableBody");
  if (!tbody) return;
  const recent = allReservations.slice(0, 5);
  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📋</div><p>No hay reservas aún.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(r => rowHTML(r)).join("");
}

// ─── FULL TABLE ───────────────────────────────────────────────
let currentSearchTerm = "";

function renderFullTable() {
  const tbody = document.getElementById("fullTableBody");
  if (!tbody) return;

  let list = allReservations;

  if (currentTableFilter !== "todas") {
    list = list.filter(r => r.estado === currentTableFilter);
  }
  if (currentSearchTerm) {
    const term = currentSearchTerm.toLowerCase();
    list = list.filter(r =>
      (r.nombre || "").toLowerCase().includes(term) ||
      (r.servicio || "").toLowerCase().includes(term) ||
      (r.telefono || "").toLowerCase().includes(term)
    );
  }

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron reservas.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(r => rowHTML(r)).join("");
}

function rowHTML(r) {
  const price = getPrice(r.servicio);
  return `
    <tr>
      <td class="td-name">${r.nombre || "—"}</td>
      <td class="td-service">${r.servicio || "—"}</td>
      <td>${formatDate(r.fecha)}</td>
      <td>${r.hora || "—"}</td>
      <td>${badgeHTML(r.estado || "pendiente")}</td>
      <td class="td-price">${price ? `$${price}` : "—"}</td>
      <td>${actionBtns(r.id, r.estado, r.telefono, r.nombre, r.servicio)}</td>
    </tr>`;
}

window.setTableFilter = function (filter, btn) {
  currentTableFilter = filter;
  document.querySelectorAll(".status-filter").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderFullTable();
};

window.applySearch = function () {
  currentSearchTerm = document.getElementById("searchInput")?.value || "";
  renderFullTable();
};

// ─── CONFIRM RESERVATION ─────────────────────────────────────
window.confirmReservation = async (id) => {
  const r = allReservations.find(x => x.id === id);
  if (!r) return;
  try {
    await updateDoc(doc(db, "reservas", id), { estado: "confirmada" });

    // Create Google Calendar event
    if (r.fecha && r.hora) {
      const eventId = await addCalendarEvent({
        summary: `${r.servicio} — ${r.nombre}`,
        description: `Cliente: ${r.nombre}\nTeléfono: ${r.telefono || "N/A"}\nServicio: ${r.servicio}`,
        date: r.fecha,
        hour: r.hora,
        duration: 90 // minutes
      });
      if (eventId) {
        await updateDoc(doc(db, "reservas", id), { calendarEventId: eventId });
      }
    }

    showToast("✅ Cita confirmada y agregada al calendario.");
  } catch (err) {
    console.error(err);
    showToast("⚠️ Error al confirmar la cita.");
  }
};

// ─── EDIT MODAL ───────────────────────────────────────────────
window.openEditModal = function (id) {
  const r = allReservations.find(x => x.id === id);
  if (!r) return;
  document.getElementById("editDocId").value     = id;
  document.getElementById("editNombre").value    = r.nombre || "";
  document.getElementById("editServicio").value  = r.servicio || "";
  document.getElementById("editFecha").value     = r.fecha || "";
  document.getElementById("editHora").value      = r.hora || "";
  document.getElementById("editEstado").value    = r.estado || "pendiente";
  document.getElementById("editTelefono").value  = r.telefono || "";
  document.getElementById("editModal").classList.add("open");
};

window.saveEdit = async function () {
  const id       = document.getElementById("editDocId").value;
  const nombre   = document.getElementById("editNombre").value.trim();
  const servicio = document.getElementById("editServicio").value;
  const fecha    = document.getElementById("editFecha").value;
  const hora     = document.getElementById("editHora").value;
  const estado   = document.getElementById("editEstado").value;
  const telefono = document.getElementById("editTelefono").value.trim();

  if (!nombre || !servicio) {
    showToast("⚠️ Nombre y servicio son obligatorios.");
    return;
  }

  try {
    const r = allReservations.find(x => x.id === id);
    const updates = { nombre, servicio, fecha, hora, estado, telefono };
    await updateDoc(doc(db, "reservas", id), updates);

    // If confirmed AND date changed, update or recreate calendar event
    if (estado === "confirmada" && fecha && hora) {
      if (r?.calendarEventId) {
        await removeCalendarEvent(r.calendarEventId);
      }
      const newEventId = await addCalendarEvent({
        summary: `${servicio} — ${nombre}`,
        description: `Cliente: ${nombre}\nTeléfono: ${telefono || "N/A"}\nServicio: ${servicio}`,
        date: fecha,
        hour: hora,
        duration: 90
      });
      if (newEventId) {
        await updateDoc(doc(db, "reservas", id), { calendarEventId: newEventId });
      }
    }

    document.getElementById("editModal").classList.remove("open");
    showToast("✏️ Cambios guardados.");
  } catch (err) {
    console.error(err);
    showToast("⚠️ Error al guardar los cambios.");
  }
};

// ─── DELETE ───────────────────────────────────────────────────
window.openDeleteModal = function (id) {
  document.getElementById("deleteDocId").value = id;
  document.getElementById("deleteModal").classList.add("open");
};

window.confirmDelete = async function () {
  const id = document.getElementById("deleteDocId").value;
  try {
    const r = allReservations.find(x => x.id === id);
    if (r?.calendarEventId) {
      await removeCalendarEvent(r.calendarEventId);
    }
    await deleteDoc(doc(db, "reservas", id));
    document.getElementById("deleteModal").classList.remove("open");
    showToast("🗑️ Cita eliminada.");
  } catch (err) {
    console.error(err);
    showToast("⚠️ Error al eliminar la cita.");
  }
};

// ─── WHATSAPP ─────────────────────────────────────────────────
window.sendWA = function (phone, nombre, servicio) {
  const msg = `Hola ${nombre}, te confirmamos tu cita de *${servicio}* en Eternal Beauty Studio. ✨ Si necesitas reagendar, escríbenos.`;
  window.open(`https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`, "_blank");
};

// ─── CALENDAR ────────────────────────────────────────────────
function renderCalendar() {
  const grid = document.getElementById("calGrid");
  const titleEl = document.getElementById("calTitle");
  if (!grid) return;

  const year  = calCurrentYear;
  const month = calCurrentMonth;

  const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  if (titleEl) titleEl.textContent = `${monthNames[month]} ${year}`;

  // Get reservations for this month
  const monthStr = `${year}-${String(month+1).padStart(2,"0")}`;
  const monthRes = allReservations.filter(r => (r.fecha || "").startsWith(monthStr));

  // Group by day
  const byDay = {};
  monthRes.forEach(r => {
    const day = (r.fecha || "").split("-")[2];
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(r);
  });

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today = new Date();

  const dayHeaders = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

  let html = dayHeaders.map(d => `<div class="cal-day-header">${d}</div>`).join("");

  // Leading blanks
  const startOffset = firstDay; // 0=Sun
  for (let i = 0; i < startOffset; i++) {
    html += `<div class="cal-day other-month"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayKey = String(d).padStart(2,"0");
    const rList  = byDay[dayKey] || [];
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const hasA = rList.length > 0;

    const classes = [
      "cal-day",
      isToday ? "today" : "",
      hasA    ? "has-appts" : ""
    ].filter(Boolean).join(" ");

    const dayNumHTML = isToday
      ? `<div class="cal-day-num"><span style="background:var(--rose);color:white;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;">${d}</span></div>`
      : `<div class="cal-day-num">${d}</div>`;

    const fullDate = `${year}-${String(month+1).padStart(2,"0")}-${dayKey}`;

    let pillsHTML = "";
    const maxPills = 2;
    rList.slice(0, maxPills).forEach(r => {
      pillsHTML += `<div class="cal-event-pill pill-${r.estado||'pendiente'}" 
        onclick="openDayModal('${fullDate}', event)" 
        title="${r.nombre} — ${r.servicio}">${r.hora || ""} ${r.nombre || ""}
      </div>`;
    });
    if (rList.length > maxPills) {
      pillsHTML += `<div class="cal-more" onclick="openDayModal('${fullDate}', event)">+${rList.length - maxPills} más</div>`;
    }

    html += `
      <div class="${classes}" onclick="openDayModal('${fullDate}', event)">
        ${dayNumHTML}
        ${pillsHTML}
      </div>`;
  }

  grid.innerHTML = html;
}

window.changeMonth = function (dir) {
  calCurrentMonth += dir;
  if (calCurrentMonth > 11) { calCurrentMonth = 0; calCurrentYear++; }
  if (calCurrentMonth < 0)  { calCurrentMonth = 11; calCurrentYear--; }
  renderCalendar();
};

window.openDayModal = function (dateStr, event) {
  if (event) event.stopPropagation();
  const rList = allReservations.filter(r => r.fecha === dateStr);
  const [y,m,d] = dateStr.split("-");
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  document.getElementById("dayModalTitle").textContent = `${parseInt(d)} de ${months[parseInt(m)-1]} ${y}`;

  const listEl = document.getElementById("dayEventsList");
  if (!rList.length) {
    listEl.innerHTML = `<p style="color:var(--text-light);font-size:13px;text-align:center;padding:20px 0;">No hay citas este día.</p>`;
  } else {
    listEl.innerHTML = rList.map(r => `
      <div class="day-event-item ${r.estado||'pendiente'}">
        <div class="day-ev-name">${r.nombre || "—"}</div>
        <div class="day-ev-svc">${r.servicio || "—"}</div>
        <div class="day-ev-meta">${r.hora || "Sin hora"} · ${badgeHTML(r.estado||"pendiente")} · $${getPrice(r.servicio)}</div>
        <div style="display:flex;gap:6px;margin-top:8px;">
          ${r.estado === "pendiente" ? `<button class="btn-action btn-act-confirm" onclick="confirmReservation('${r.id}')">✔ Confirmar</button>` : ""}
          <button class="btn-action btn-act-edit" onclick="openEditModal('${r.id}')">✏️ Editar</button>
          <button class="btn-action btn-act-delete" onclick="openDeleteModal('${r.id}')">🗑️</button>
        </div>
      </div>`).join("");
  }
  document.getElementById("dayModal").classList.add("open");
};

// ─── CHARTS ──────────────────────────────────────────────────
function renderCharts() {
  chartsRendered = true;
  renderRevenueChart();
  renderServicesChart();
  renderStatusChart();
  renderMonthlyChart();
}

function destroyChart(instance) {
  if (instance) { try { instance.destroy(); } catch(e) {} }
}

const CHART_FONTS = {
  family: "'Jost', sans-serif",
  size: 11
};
Chart.defaults.font = CHART_FONTS;
Chart.defaults.color = "#7a7070";

// Revenue by month (confirmed only)
function renderRevenueChart() {
  destroyChart(revenueChartInst);
  const ctx = document.getElementById("revenueChart")?.getContext("2d");
  if (!ctx) return;

  const monthLabels = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const data = new Array(12).fill(0);

  allReservations
    .filter(r => r.estado === "confirmada")
    .forEach(r => {
      if (!r.fecha) return;
      const m = parseInt(r.fecha.split("-")[1]) - 1;
      if (m >= 0 && m < 12) data[m] += getPrice(r.servicio);
    });

  revenueChartInst = new Chart(ctx, {
    type: "bar",
    data: {
      labels: monthLabels,
      datasets: [{
        label: "Ingresos ($)",
        data,
        backgroundColor: "rgba(237,104,135,0.7)",
        borderColor: "#ed6887",
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#f0ebe4" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Services pie
function renderServicesChart() {
  destroyChart(servicesChartInst);
  const ctx = document.getElementById("servicesChart")?.getContext("2d");
  if (!ctx) return;

  const counts = {};
  allReservations.forEach(r => {
    if (r.servicio) counts[r.servicio] = (counts[r.servicio] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,6);
  const labels = sorted.map(([k]) => k);
  const values = sorted.map(([,v]) => v);
  const colors = ["#ed6887","#e6b86a","#f6c1cc","#6499e9","#52c47a","#d6c2a8"];

  servicesChartInst = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#fff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { padding: 12, boxWidth: 12 } }
      }
    }
  });
}

// Status bar chart
function renderStatusChart() {
  destroyChart(statusChartInst);
  const ctx = document.getElementById("statusChart")?.getContext("2d");
  if (!ctx) return;

  const statuses  = ["pendiente","confirmada","cancelada","completada"];
  const labels    = ["Pendientes","Confirmadas","Canceladas","Completadas"];
  const colors    = ["rgba(230,184,99,0.7)","rgba(82,196,122,0.7)","rgba(237,104,135,0.7)","rgba(100,153,233,0.7)"];
  const values    = statuses.map(s => allReservations.filter(r => r.estado === s).length);

  statusChartInst = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f0ebe4" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Monthly count
function renderMonthlyChart() {
  destroyChart(monthlyChartInst);
  const ctx = document.getElementById("monthlyChart")?.getContext("2d");
  if (!ctx) return;

  const monthLabels = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const data = new Array(12).fill(0);

  allReservations.forEach(r => {
    if (!r.fecha) return;
    const m = parseInt(r.fecha.split("-")[1]) - 1;
    if (m >= 0 && m < 12) data[m]++;
  });

  monthlyChartInst = new Chart(ctx, {
    type: "line",
    data: {
      labels: monthLabels,
      datasets: [{
        label: "Citas",
        data,
        borderColor: "#ed6887",
        backgroundColor: "rgba(237,104,135,0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#ed6887",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f0ebe4" } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ─── EXPORT EXCEL ─────────────────────────────────────────────
window.exportExcel = async function () {
  if (!allReservations.length) {
    showToast("⚠️ No hay datos para exportar.");
    return;
  }

  // Load SheetJS dynamically
  if (!window.XLSX) {
    await new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  const rows = allReservations.map(r => ({
    "Nombre":    r.nombre   || "",
    "Teléfono":  r.telefono || "",
    "Servicio":  r.servicio || "",
    "Fecha":     r.fecha    || "",
    "Hora":      r.hora     || "",
    "Estado":    r.estado   || "",
    "Precio ($)": getPrice(r.servicio),
    "Mensaje":   r.mensaje  || "",
    "Registrado": r.creadoEn?.toDate
      ? r.creadoEn.toDate().toLocaleString("es-ES")
      : ""
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws["!cols"] = [
    {wch:22},{wch:16},{wch:22},{wch:12},{wch:8},{wch:14},{wch:10},{wch:30},{wch:20}
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reservas");

  const filename = `eternal_beauty_reservas_${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, filename);
  showToast("📥 Excel descargado.");
};

// ─── INIT ─────────────────────────────────────────────────────
// Charts are rendered on first statsTab open (lazy)
document.addEventListener("DOMContentLoaded", () => {
  // Override switchTab to trigger chart rendering
  const origSwitch = window.switchTab;
  window.switchTab = function(tabId, triggerEl) {
    origSwitch(tabId, triggerEl);
    if (tabId === "statsTab" && !chartsRendered && allReservations.length >= 0) {
      setTimeout(renderCharts, 100);
    }
  };
});