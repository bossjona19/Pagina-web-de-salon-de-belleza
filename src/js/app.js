// app.js — Inicializador del sitio público (index.html)
// Importa los módulos y conecta todo en DOMContentLoaded.

import { auth } from "./firebase-config.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { renderFilters, renderServices } from "./services.js";
import { generarHoras, setFpInstance, initReservaListeners } from "./reservas.js";
import { initScrollAnimations, initSlider, initLoginModal, initInstallButton } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  // Sesión anónima para que cualquier visitante pueda leer reservas de Firestore
  signInAnonymously(auth).catch(err => console.warn("Anon auth:", err.message));

  initLoginModal();

  renderFilters();
  renderServices();
  initScrollAnimations();

  // Flatpickr reemplaza input[type=date] nativo.
  // disableMobile:true fuerza el calendario custom en iOS y Android.
  const fp = flatpickr("#fdate", {
    dateFormat:    "Y-m-d",
    minDate:       "today",
    disableMobile: true,
    locale:        "es",
    disable:       [date => date.getDay() === 0],
    onChange:      () => generarHoras()
  });
  setFpInstance(fp);

  initSlider("ba1", "afterWrap1", "baDivider1", "baHandle1");
  initSlider("ba2", "afterWrap2", "baDivider2", "baHandle2");
  initReservaListeners();
  initInstallButton();

  document.getElementById("heroBtnServicios")?.addEventListener("click", () =>
    document.querySelector("#servicios").scrollIntoView({ behavior: "smooth" })
  );
  document.getElementById("heroBtnContacto")?.addEventListener("click", () =>
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" })
  );

  if (window.lucide) lucide.createIcons();
});
