(function () {
  if (!("serviceWorker" in navigator)) return;

  // Evita recargas en loop si controllerchange dispara múltiples veces
  let refreshing = false;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {

        // Caso: ya había un SW esperando cuando se cargó la página
        // (e.g. el usuario refrescó sin hacer click en "Actualizar")
        if (reg.waiting) {
          showUpdateToast(reg.waiting);
          return;
        }

        // Detectar cuando un nuevo SW empieza a instalarse
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            // El nuevo SW terminó de instalar y está esperando
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdateToast(newWorker);
            }
          });
        });
      })
      .catch((err) => console.warn("SW registration failed:", err.message));

    // Cuando el nuevo SW toma control → recargar UNA SOLA VEZ
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });

  function showUpdateToast(worker) {
    const toast = document.getElementById("updateToast");
    const btn   = document.getElementById("updateToastBtn");
    if (!toast || !btn) return;

    // Forzar reflow antes de la animación para que CSS transition funcione
    toast.getBoundingClientRect();
    toast.classList.add("show");

    btn.addEventListener("click", () => {
      toast.classList.remove("show");
      worker.postMessage({ type: "SKIP_WAITING" });
    }, { once: true });
  }
})();
