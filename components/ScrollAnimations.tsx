"use client";

// ============================================================
// components/ScrollAnimations.tsx
// ============================================================
// Componente invisible que activa las animaciones CSS.
//
// ¿Cómo funciona?
// - IntersectionObserver "observa" los elementos con clase "fade-up"
// - Cuando un elemento entra al viewport (campo de visión del usuario)
// - Le agrega la clase "visible" → se activa la animación CSS
// - Una vez visible, deja de observarlo (para no repetir la animación)
// ============================================================

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    // Crear el observador
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // El elemento está visible → activar animación
            entry.target.classList.add("visible");
            // Dejar de observarlo (la animación ya corrió)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12, // El elemento debe estar 12% visible para activarse
      }
    );

    // Observar todos los elementos con clase fade-up
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

    // Limpiar cuando el componente se desmonte
    return () => observer.disconnect();
  }, []);

  // No renderiza nada visible
  return null;
}
