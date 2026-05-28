// reservas.js — Disponibilidad de horas y envío de reservas a Firestore

import { db } from "./firebase-config.js";
import {
  collection, addDoc, getDocs, query, where, Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getDuracion } from "./services.js";

const BUFFER_MIN = 30;
let horasBloqueadas = new Set();
let _fpInstance = null;

export function setFpInstance(fp) {
  _fpInstance = fp;
}

function calcHorasOcupadas(reservaciones) {
  const bloqueadas = new Set();
  reservaciones.forEach(({ hora, servicio }) => {
    if (!hora) return;
    const hh        = parseInt(hora.split(":")[0]);
    const inicioMin = hh * 60;
    const totalMin  = getDuracion(servicio) + BUFFER_MIN;
    for (let h = 9; h <= 18; h++) {
      if (h * 60 >= inicioMin && h * 60 < inicioMin + totalMin) {
        bloqueadas.add(`${String(h).padStart(2, "0")}:00`);
      }
    }
  });
  return bloqueadas;
}

export async function generarHoras() {
  const grid   = document.getElementById("hourGrid");
  const hidden = document.getElementById("fhour");
  const fecha  = document.getElementById("fdate")?.value || "";
  if (!grid) return;

  if (!fecha) {
    grid.innerHTML = '<p class="hour-grid-hint">Selecciona una fecha primero</p>';
    if (hidden) hidden.value = "";
    horasBloqueadas = new Set();
    return;
  }

  grid.innerHTML = Array.from({ length: 10 }, () =>
    '<div class="hour-btn-skeleton" aria-hidden="true"></div>'
  ).join("");
  if (hidden) hidden.value = "";

  let reservadas = [];
  try {
    const snap = await getDocs(
      query(
        collection(db, "reservas"),
        where("fecha", "==", fecha),
        where("estado", "in", ["pendiente", "confirmada"])
      )
    );
    reservadas = snap.docs.map(d => ({
      hora:     d.data().hora,
      servicio: d.data().servicio
    }));
  } catch (err) {
    console.warn("Error al cargar horas:", err.message);
  }

  horasBloqueadas = calcHorasOcupadas(reservadas);

  const horas = [];
  for (let h = 9; h <= 18; h++) horas.push(`${String(h).padStart(2,"0")}:00`);

  const allBusy = horas.every(h => horasBloqueadas.has(h));
  if (allBusy) {
    grid.innerHTML = `<div class="hour-grid-empty">
      <strong>Sin disponibilidad</strong>
      No hay horarios libres para esta fecha. Prueba con otro día.
    </div>`;
    return;
  }

  grid.innerHTML = horas.map((hora, i) => {
    const busy = horasBloqueadas.has(hora);
    return `<button type="button"
      class="hour-btn"
      ${busy ? "disabled" : ""}
      data-hora="${hora}"
      style="animation-delay:${i * 30}ms"
      aria-label="${hora}${busy ? " — Ocupada" : ""}">
      ${hora}${busy ? `<span class="hour-btn-busy-tag">Ocupada</span>` : ""}
    </button>`;
  }).join("");

  grid.querySelectorAll(".hour-btn:not(:disabled)").forEach(btn => {
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".hour-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      if (hidden) hidden.value = btn.dataset.hora;
      document.getElementById("fhour-error")?.classList.remove("show");
    });
  });
}

export async function submitForm() {
  const btn = document.getElementById("submitBtn");
  if (btn) { btn.disabled = true; btn.classList.add("loading"); }

  const name    = document.getElementById("fname")?.value.trim()  || "";
  const phone   = document.getElementById("fphone")?.value.trim() || "";
  const service = document.getElementById("fservice")?.value      || "";
  const date    = document.getElementById("fdate")?.value         || "";
  const hour    = document.getElementById("fhour")?.value         || "";
  const msg     = document.getElementById("fmsg")?.value.trim()   || "";

  document.querySelectorAll(".form-error").forEach(e => e.classList.remove("show"));

  let valid = true;
  if (!name)                      { document.getElementById("fname-error").classList.add("show");    valid = false; }
  if (!phone || phone.length < 6) { document.getElementById("fphone-error").classList.add("show");   valid = false; }
  if (!service)                   { document.getElementById("fservice-error").classList.add("show"); valid = false; }

  if (!valid) {
    if (btn) { btn.disabled = false; btn.classList.remove("loading"); }
    return;
  }

  if (hour && horasBloqueadas.has(hour)) {
    const ok = document.getElementById("successMsg");
    if (ok) {
      ok.textContent = "⚠️ Hora ocupada. Por favor selecciona otra hora.";
      ok.style.cssText = "background:rgba(201,112,126,.12);color:#a85460;";
      ok.classList.add("show");
      setTimeout(() => { ok.classList.remove("show"); ok.removeAttribute("style"); }, 4000);
    }
    document.getElementById("fhour").value = "";
    if (btn) { btn.disabled = false; btn.classList.remove("loading"); }
    return;
  }

  if (date && hour) {
    try {
      const snap = await getDocs(
        query(collection(db, "reservas"), where("fecha", "==", date), where("estado", "in", ["pendiente", "confirmada"]))
      );
      const existentes = snap.docs.map(d => ({ hora: d.data().hora, servicio: d.data().servicio }));
      const bloqueadas = calcHorasOcupadas(existentes);
      if (bloqueadas.has(hour)) {
        await generarHoras();
        const ok = document.getElementById("successMsg");
        if (ok) {
          ok.textContent = "Ese horario acaba de ser reservado. Por favor elige otra hora.";
          ok.style.cssText = "background:rgba(201,112,126,.12);color:#a85460;";
          ok.classList.add("show");
          setTimeout(() => {
            ok.classList.remove("show");
            ok.removeAttribute("style");
            ok.textContent = "¡Solicitud enviada! Te contactaré pronto para confirmar tu cita.";
          }, 5000);
        }
        if (btn) { btn.disabled = false; btn.classList.remove("loading"); }
        return;
      }
    } catch (err) {
      console.warn("Error al verificar horario:", err.message);
    }
  }

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
    const ok = document.getElementById("successMsg");
    if (ok) {
      ok.textContent = "⚠️ Error al guardar la reserva. Revisa tu conexión e intenta de nuevo.";
      ok.style.cssText = "background:rgba(201,112,126,.12);color:#a85460;";
      ok.classList.add("show");
      setTimeout(() => { ok.classList.remove("show"); ok.removeAttribute("style"); }, 5000);
    }
    if (btn) { btn.disabled = false; btn.classList.remove("loading"); }
    return;
  }

  const waMsg = `Hola, quiero confirmar mi reserva:\n\n👤 ${name}\n📱 ${phone}\n✂️ ${service}\n📅 ${date || "Sin fecha"}\n🕐 ${hour || "Sin hora"}\n💬 ${msg || "—"}`;
  const waUrl = `https://wa.me/50765991047?text=${encodeURIComponent(waMsg)}`;

  ["fname", "fphone", "fservice", "fmsg"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  document.getElementById("fhour").value = "";
  if (_fpInstance) _fpInstance.clear();

  const ok = document.getElementById("successMsg");
  if (ok) {
    ok.innerHTML = `✅ ¡Solicitud enviada!&nbsp;&nbsp;<a href="${waUrl}" target="_blank" rel="noopener" class="btn-wa-link">💬 Confirmar por WhatsApp</a>`;
    ok.removeAttribute("style");
    ok.classList.add("show");
    setTimeout(() => {
      ok.classList.remove("show");
      ok.textContent = "✅ ¡Solicitud enviada! Te contactaré pronto para confirmar tu cita.";
    }, 14000);
  }

  if (btn) { btn.disabled = false; btn.classList.remove("loading"); }
}
window.submitForm = submitForm;

export function initReservaListeners() {
  document.getElementById("submitBtn")?.addEventListener("click", submitForm);
  document.getElementById("fhour")?.addEventListener("change", e => {
    const errEl = document.getElementById("fhour-error");
    if (!errEl) return;
    if (horasBloqueadas.has(e.target.value)) {
      e.target.value = "";
      errEl.classList.add("show");
      setTimeout(() => errEl.classList.remove("show"), 3000);
    } else {
      errEl.classList.remove("show");
    }
  });
}
