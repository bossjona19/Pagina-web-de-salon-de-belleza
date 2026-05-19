// ui.js — Navegación, modales, sliders, animaciones y login admin

import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ── NAV SCROLL ──────────────────────────────────────────────
window.addEventListener("scroll", () => {
  document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 40);
});

// ── HAMBURGER (MÓVIL) ───────────────────────────────────────
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

// ── GALERÍA SCROLL ──────────────────────────────────────────
window.scrollGallery = function (dir) {
  const c = document.getElementById("gallery");
  if (!c) return;
  const max = c.scrollWidth - c.clientWidth;
  if      (dir ===  1 && c.scrollLeft >= max - 10) c.scrollTo({ left: 0,   behavior: "smooth" });
  else if (dir === -1 && c.scrollLeft <= 0)         c.scrollTo({ left: max, behavior: "smooth" });
  else    c.scrollBy({ left: dir * 300, behavior: "smooth" });
};

// ── MODAL DE IMAGEN ─────────────────────────────────────────
window.openModal  = src => {
  document.getElementById("modalImg").src = src;
  document.getElementById("imageModal").classList.add("show");
};
window.closeModal = () => document.getElementById("imageModal")?.classList.remove("show");

// ── SCROLL ANIMATIONS ────────────────────────────────────────
export function initScrollAnimations() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".fade-up, .gallery-item").forEach(el => io.observe(el));
}

// ── BEFORE / AFTER SLIDER ───────────────────────────────────
export function initSlider(containerId, afterWrapId, dividerId, handleId) {
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
    afterWrap.style.width = `${pct}%`;
    divider.style.left    = `${pct}%`;
    handle.style.left     = `calc(${pct}% - 0px)`;
  }

  handle.addEventListener("mousedown",  e => { e.preventDefault(); dragging = true;  container.classList.add("dragging"); });
  handle.addEventListener("touchstart", ()  => { dragging = true;  container.classList.add("dragging"); }, { passive: true });
  window.addEventListener("mousemove",  e   => { if (dragging) setPos(e.clientX); });
  window.addEventListener("touchmove",  e   => { if (dragging) { e.preventDefault(); setPos(e.touches[0].clientX); } }, { passive: false });
  ["mouseup", "touchend", "touchcancel"].forEach(ev =>
    window.addEventListener(ev, () => { dragging = false; container.classList.remove("dragging"); })
  );
}

// ── LOGIN ADMIN ─────────────────────────────────────────────
const AUTH_ERRORS = {
  "auth/invalid-credential":   "Correo o contraseña incorrectos.",
  "auth/user-not-found":       "No existe una cuenta con ese correo.",
  "auth/wrong-password":       "Contraseña incorrecta.",
  "auth/invalid-email":        "El correo no es válido.",
  "auth/too-many-requests":    "Demasiados intentos. Intenta más tarde.",
  "auth/popup-closed-by-user": "Cerraste el popup antes de completar el login."
};

function setLoginLoading(loading, btnId = "loginBtn", text = "Iniciar sesión") {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled    = loading;
  btn.textContent = loading ? "Entrando…" : text;
}

function showLoginError(msg) {
  const errEl = document.getElementById("loginError");
  if (!errEl) return;
  errEl.textContent    = msg;
  errEl.style.display  = "block";
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

export function initLoginModal() {
  const loginModal = document.getElementById("loginModal");
  if (!loginModal) return;
  loginModal.addEventListener("click", e => {
    if (e.target === loginModal) loginModal.classList.remove("open");
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") loginModal.classList.remove("open");
  });
  document.getElementById("loginPassword")?.addEventListener("keydown", e => {
    if (e.key === "Enter") window.handleAdminLogin();
  });
}
