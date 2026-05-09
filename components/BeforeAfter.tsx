"use client";

// ============================================================
// components/BeforeAfter.tsx
// ============================================================
// Slider de comparación antes/después.
// Funciona con mouse en desktop Y con toque en móvil.
// El handle (botón) es el único elemento que inicia el drag.
// ============================================================

import { useRef, useState, useCallback, useEffect } from "react";

interface BeforeAfterProps {
  beforeSrc: string; // URL de la imagen "antes"
  afterSrc: string; // URL de la imagen "después"
  beforeAlt?: string;
  afterAlt?: string;
}

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeAlt = "Antes",
  afterAlt = "Después",
}: BeforeAfterProps) {
  // ── Estado ─────────────────────────────────────────────
  // position: porcentaje de la división (0 a 100)
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  // ── Referencias ────────────────────────────────────────
  // containerRef apunta al div principal para calcular coordenadas
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Calcular posición ──────────────────────────────────
  const setPositionFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  // ── Handlers de mouse ──────────────────────────────────
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) setPositionFromClientX(e.clientX);
    },
    [dragging, setPositionFromClientX],
  );

  const onMouseUp = useCallback(() => setDragging(false), []);

  // ── Handlers de toque (para móvil) ────────────────────
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (dragging) {
        e.preventDefault(); // Evita que la página haga scroll mientras arrastras
        setPositionFromClientX(e.touches[0].clientX);
      }
    },
    [dragging, setPositionFromClientX],
  );

  const onTouchEnd = useCallback(() => setDragging(false), []);

  // ── Escuchar eventos globales (window) ─────────────────
  // Así el drag sigue funcionando aunque el mouse salga del slider
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        // En móvil más pequeño, en desktop más grande
        height: "clamp(240px, 40vw, 420px)",
        overflow: "hidden",
        borderRadius: "16px",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none", // Evita conflicto con scroll de la página
        boxShadow: "var(--shadow-lg)",
        cursor: dragging ? "ew-resize" : "default",
      }}
    >
      {/* ── Imagen ANTES (fondo completo) ─────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={beforeSrc}
        alt={beforeAlt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none", // No recibe clicks ni toque
        }}
        draggable={false}
      />

      {/* ── Imagen DESPUÉS (encima, cortada según position) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${position}%`, // Se expande/contrae al mover el handle
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterSrc}
          alt={afterAlt}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            // El ancho real es el del contenedor padre (100% del slider)
            // necesita ser fijo para no estirarse
            width: containerRef.current?.offsetWidth
              ? `${containerRef.current.offsetWidth}px`
              : "100%",
            height: "100%",
            objectFit: "cover",
          }}
          draggable={false}
        />
      </div>

      {/* ── Línea divisoria ───────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${position}%`,
          width: "2px",
          background: "white",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          boxShadow: "0 0 8px rgba(0,0,0,0.3)",
        }}
      />

      {/* ── Handle (el botón que arrastra) ────────────── */}
      {/* IMPORTANTE: solo el handle inicia el drag, no la imagen */}
      <button
        aria-label="Arrastra para comparar antes y después"
        onMouseDown={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onTouchStart={(e) => {
          // e.preventDefault(); // Solo si causa problemas en iOS
          setDragging(true);
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: dragging ? "var(--rose-dark)" : "var(--rose)",
          border: "3px solid white",
          cursor: "ew-resize",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          transition: dragging ? "none" : "background 0.2s ease",
          zIndex: 10,
          // En móvil hacemos el handle más grande para facilitar el toque
          touchAction: "none",
        }}
      >
        {/* Íconos de flecha izquierda y derecha */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7 4L2 10l5 6M13 4l5 6-5 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Etiquetas Antes / Después ─────────────────── */}
      <span
        style={{
          position: "absolute",
          bottom: "14px",
          left: "14px",
          background: "rgba(0,0,0,0.45)",
          color: "white",
          fontSize: "10px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          padding: "5px 12px",
          borderRadius: "50px",
          backdropFilter: "blur(4px)",
          pointerEvents: "none",
          fontFamily: "var(--font-sans)",
        }}
      >
        Antes
      </span>

      <span
        style={{
          position: "absolute",
          bottom: "14px",
          right: "14px",
          background: "rgba(0,0,0,0.45)",
          color: "white",
          fontSize: "10px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          padding: "5px 12px",
          borderRadius: "50px",
          backdropFilter: "blur(4px)",
          pointerEvents: "none",
          fontFamily: "var(--font-sans)",
        }}
      >
        Después
      </span>
    </div>
  );
}
