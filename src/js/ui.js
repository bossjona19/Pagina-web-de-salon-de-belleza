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

// ── SCROLL ANIMATIONS ────────────────────────────────────────
export function initScrollAnimations() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".fade-up").forEach(el => io.observe(el));
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

  const openModal  = () => loginModal.classList.add("open");
  const closeModal = () => loginModal.classList.remove("open");

  // Open triggers
  document.getElementById("footerAdminBtn")?.addEventListener("click", openModal);
  document.querySelectorAll(".mobile-admin-link").forEach(btn =>
    btn.addEventListener("click", () => { window.closeMobileNav?.(); openModal(); })
  );

  // Close triggers
  loginModal.querySelector(".login-close-btn")?.addEventListener("click", closeModal);
  loginModal.addEventListener("click", e => { if (e.target === loginModal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  document.getElementById("loginPassword")?.addEventListener("keydown", e => {
    if (e.key === "Enter") window.handleAdminLogin();
  });
}

// ── BOTÓN INSTALAR PWA ───────────────────────────────────────
export function initInstallButton() {
  if (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  ) return;

  // iOS Safari: sin soporte nativo — no mostrar nada
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua) ||
                (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios|edgios|gsa/i.test(ua);
  if (isIOS && isSafari) return;

  const btn = document.getElementById("installBtn");
  if (!btn) return;

  if (window.__pwaInstallPrompt) {
    console.log("[PWA] beforeinstallprompt capturado temprano");
    btn.classList.add("visible");
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("[PWA] beforeinstallprompt disparado");
    e.preventDefault();
    window.__pwaInstallPrompt = e;
    btn.classList.add("visible");
  });

  window.addEventListener("appinstalled", () => {
    console.log("[PWA] App instalada");
    btn.classList.remove("visible");
    window.__pwaInstallPrompt = null;
  });

  btn.addEventListener("click", async () => {
    const prompt = window.__pwaInstallPrompt;
    if (!prompt) return;
    window.__pwaInstallPrompt = null;
    btn.disabled = true;
    try {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log("[PWA] Elección del usuario:", outcome);
      btn.classList.remove("visible");
    } catch (err) {
      console.warn("[PWA] Error al instalar:", err);
    } finally {
      btn.disabled = false;
    }
  });
}
