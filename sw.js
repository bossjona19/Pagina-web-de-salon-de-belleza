// sw.js - Service Worker - Eternal Beauty Studio

const CACHE_SHELL = "ebs-shell-v4";
const CACHE_CDN = "ebs-cdn-v1";

// Archivos principales de la app
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",

  "/src/css/styles.css",

  "/src/js/app.js",
  "/src/js/services.js",
  "/src/js/reservas.js",
  "/src/js/ui.js",
  "/src/js/sw-register.js",

  "/src/assets/img/1.jpeg",
  "/src/assets/img/2.jpeg",
  "/src/assets/img/3.jpeg",
  "/src/assets/img/4.jpeg",
  "/src/assets/img/5.jpeg",

  "/src/assets/icons/icon.svg",

  "/favicon/favicon.svg",
  "/favicon/favicon-96x96.png",
  "/favicon/apple-touch-icon.png",
  "/favicon/web-app-manifest-192x192.png",
  "/favicon/web-app-manifest-512x512.png"
];

// =========================
// INSTALL
// =========================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_SHELL).then((cache) => cache.addAll(SHELL))
  );
  // No skipWaiting aquí: el nuevo SW espera hasta que el usuario
  // apruebe la actualización desde el toast (SKIP_WAITING message).
});

// El toast de actualización envía este mensaje para activar el nuevo SW.
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// =========================
// ACTIVATE
// =========================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) =>
              key !== CACHE_SHELL &&
              key !== CACHE_CDN
          )
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// =========================
// FETCH
// =========================
self.addEventListener("fetch", (event) => {

  const request = event.request;
  const url = new URL(request.url);

  // =========================================
  // 1. Firebase APIs -> NO cache
  // =========================================
  if (
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("securetoken.googleapis.com") ||
    url.hostname.includes("identitytoolkit.googleapis.com")
  ) {
    return;
  }

  // =========================================
  // 2. CDN externos
  // stale-while-revalidate
  // =========================================
  if (
    url.hostname === "www.gstatic.com" ||
    url.hostname === "cdn.jsdelivr.net" ||
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {

    event.respondWith(
      caches.open(CACHE_CDN).then((cache) => {

        return cache.match(request).then((cachedResponse) => {

          const networkFetch = fetch(request)
            .then((networkResponse) => {

              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
              }

              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || networkFetch;
        });
      })
    );

    return;
  }

  // =========================================
  // 3. Navegación HTML
  // network-first
  // =========================================
  if (request.mode === "navigate") {

    event.respondWith(

      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_SHELL).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {

          return caches.match(request)
            .then((cached) => {
              return cached || caches.match("/index.html");
            });
        })
    );

    return;
  }

  // =========================================
  // 4. Assets locales
  // cache-first
  // =========================================
  event.respondWith(

    caches.match(request).then((cachedResponse) => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {

        if (
          !networkResponse ||
          networkResponse.status !== 200
        ) {
          return networkResponse;
        }

        const clone = networkResponse.clone();
        caches.open(CACHE_SHELL).then((cache) => {
          cache.put(request, clone);
        });

        return networkResponse;
      });
    })
  );
});