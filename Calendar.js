// ============================================================
// calendar.js — Eternal Beauty Studio
// Integración con Google Calendar API (solo admin)
// ============================================================
//
// SETUP REQUERIDO:
// 1. Ve a https://console.cloud.google.com/
// 2. Crea o selecciona tu proyecto
// 3. Habilita "Google Calendar API"
// 4. Crea credenciales OAuth 2.0 (tipo: Aplicación web)
//    - Redirect URIs: http://localhost (dev) y tu dominio de producción
// 5. Crea una API Key (restringida a Calendar API)
// 6. Reemplaza las constantes de abajo con tus valores reales
// 7. Agrega tu dominio a "Orígenes autorizados" en Google Cloud Console
//
// NOTA: El cliente NUNCA accede a esta API. Solo el admin autenticado
//       puede crear/editar/eliminar eventos en su propio calendario.
// ============================================================

// ── ⚠️ CONFIGURACIÓN — CAMBIA ESTOS VALORES ─────────────────
const GCAL_CLIENT_ID  = "680509237149-umdm4820kc4otkkfl17nvcgl1pgkrhrf.apps.googleusercontent.com";
const GCAL_API_KEY    = "AIzaSyDISg9Le0YppqqanblwmybDSfW6VphA3Ak";
const GCAL_CALENDAR_ID = "primary"; // "primary" usa el calendario principal del admin
const GCAL_SCOPES     = "https://www.googleapis.com/auth/calendar.events";
// ─────────────────────────────────────────────────────────────

let gapiReady      = false;
let gisReady       = false;
let tokenClient    = null;
let accessToken    = null;
let authInProgress = false;

// ── Cargar Google APIs dinámicamente ─────────────────────────
function loadGapiScript() {
  return new Promise((resolve, reject) => {
    if (window.gapi) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadGisScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function initGoogleAPIs() {
  if (gapiReady && gisReady) return true;

  // Skip if credentials not configured
  if (
    GCAL_CLIENT_ID.includes("TU_") ||
    GCAL_API_KEY.includes("TU_")
  ) {
    console.warn("[calendar.js] Google Calendar no configurado. Agrega tus credenciales.");
    return false;
  }

  try {
    await Promise.all([loadGapiScript(), loadGisScript()]);

    // Init GAPI client
    await new Promise((resolve, reject) => {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            apiKey: GCAL_API_KEY,
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
          });
          gapiReady = true;
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });

    // Init GIS token client
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GCAL_CLIENT_ID,
      scope: GCAL_SCOPES,
      callback: (tokenResponse) => {
        if (tokenResponse?.access_token) {
          accessToken = tokenResponse.access_token;
          window.gapi.client.setToken({ access_token: accessToken });
        }
        authInProgress = false;
      }
    });

    gisReady = true;
    return true;
  } catch (err) {
    console.error("[calendar.js] Error iniciando Google APIs:", err);
    return false;
  }
}

// ── Obtener token de acceso (solicita consentimiento si es necesario) ─
async function ensureToken() {
  if (accessToken) {
    window.gapi.client.setToken({ access_token: accessToken });
    return true;
  }

  return new Promise((resolve) => {
    if (authInProgress) {
      // Wait for auth to complete
      const interval = setInterval(() => {
        if (!authInProgress) {
          clearInterval(interval);
          resolve(!!accessToken);
        }
      }, 200);
      return;
    }

    authInProgress = true;
    tokenClient.callback = (tokenResponse) => {
      authInProgress = false;
      if (tokenResponse?.access_token) {
        accessToken = tokenResponse.access_token;
        window.gapi.client.setToken({ access_token: accessToken });
        resolve(true);
      } else {
        resolve(false);
      }
    };

    // If no token yet, prompt user
    tokenClient.requestAccessToken({ prompt: "consent" });
  });
}

// ─────────────────────────────────────────────────────────────
// EXPORT: addCalendarEvent
//
// Params:
//   { summary, description, date (YYYY-MM-DD), hour ("HH:MM"), duration (minutes) }
//
// Returns:
//   eventId (string) | null
// ─────────────────────────────────────────────────────────────
export async function addCalendarEvent({ summary, description, date, hour, duration = 90 }) {
  const ready = await initGoogleAPIs();
  if (!ready) {
    console.warn("[calendar.js] Google Calendar no disponible. El evento no se creó.");
    return null;
  }

  const hasToken = await ensureToken();
  if (!hasToken) {
    console.warn("[calendar.js] No se pudo obtener token de acceso.");
    return null;
  }

  try {
    const startDateTime = buildISODateTime(date, hour);
    const endDateTime   = addMinutes(startDateTime, duration);

    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: "America/Panama"
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Panama"
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup",  minutes: 60 },
          { method: "email",  minutes: 1440 } // 24h before
        ]
      },
      colorId: "1" // Lavender — distinguishes EBS events
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: GCAL_CALENDAR_ID,
      resource: event
    });

    const eventId = response.result?.id;
    console.log("[calendar.js] Evento creado:", eventId);
    return eventId || null;

  } catch (err) {
    console.error("[calendar.js] Error creando evento:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// EXPORT: removeCalendarEvent
//
// Params:
//   eventId (string)
// ─────────────────────────────────────────────────────────────
export async function removeCalendarEvent(eventId) {
  if (!eventId) return;

  const ready = await initGoogleAPIs();
  if (!ready) return;

  const hasToken = await ensureToken();
  if (!hasToken) return;

  try {
    await window.gapi.client.calendar.events.delete({
      calendarId: GCAL_CALENDAR_ID,
      eventId
    });
    console.log("[calendar.js] Evento eliminado:", eventId);
  } catch (err) {
    // 410 Gone = already deleted, safe to ignore
    if (err?.status !== 410) {
      console.error("[calendar.js] Error eliminando evento:", err);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// EXPORT: updateCalendarEvent
//
// Params:
//   eventId, { summary, description, date, hour, duration }
// ─────────────────────────────────────────────────────────────
export async function updateCalendarEvent(eventId, { summary, description, date, hour, duration = 90 }) {
  if (!eventId) return null;

  const ready = await initGoogleAPIs();
  if (!ready) return null;

  const hasToken = await ensureToken();
  if (!hasToken) return null;

  try {
    const startDateTime = buildISODateTime(date, hour);
    const endDateTime   = addMinutes(startDateTime, duration);

    const patch = {
      summary,
      description,
      start: { dateTime: startDateTime, timeZone: "America/Panama" },
      end:   { dateTime: endDateTime,   timeZone: "America/Panama" }
    };

    const response = await window.gapi.client.calendar.events.patch({
      calendarId: GCAL_CALENDAR_ID,
      eventId,
      resource: patch
    });

    console.log("[calendar.js] Evento actualizado:", response.result?.id);
    return response.result?.id || null;

  } catch (err) {
    console.error("[calendar.js] Error actualizando evento:", err);
    return null;
  }
}

// ─── UTILITY HELPERS ─────────────────────────────────────────

/**
 * Build an ISO 8601 datetime string in America/Panama (UTC-5, no DST)
 * e.g. date="2026-05-20", hour="14:00" → "2026-05-20T14:00:00-05:00"
 */
function buildISODateTime(date, hour) {
  if (!date || !hour) {
    // Fallback: tomorrow at 10:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const d = String(tomorrow.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}T10:00:00-05:00`;
  }
  return `${date}T${hour}:00-05:00`;
}

/**
 * Add minutes to an ISO datetime string and return a new ISO datetime string
 */
function addMinutes(isoString, minutes) {
  const date = new Date(isoString);
  date.setMinutes(date.getMinutes() + minutes);

  const pad = n => String(n).padStart(2, "0");
  const y  = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d  = pad(date.getDate());
  const h  = pad(date.getHours());
  const mi = pad(date.getMinutes());

  return `${y}-${mo}-${d}T${h}:${mi}:00-05:00`;
}