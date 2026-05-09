"use client"; // ← Esto le dice a Next.js que este componente usa el navegador

// ============================================================
// components/Navbar.tsx
// ============================================================
// La barra de navegación que aparece en la parte superior.
// Es STICKY (se queda fija al hacer scroll) y RESPONSIVE
// (en móvil se convierte en menú hamburguesa de Bootstrap).
// ============================================================

import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

export default function NavbarComponent() {
  // ── Estado ─────────────────────────────────────────────
  // "scrolled" cambia a true cuando el usuario baja la página
  // Sirve para darle sombra al nav después de hacer scroll
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Este código corre solo en el navegador, no en el servidor
    const handleScroll = () => setScrolled(window.scrollY > 40);

    // "Escuchar" el evento de scroll
    window.addEventListener("scroll", handleScroll);

    // Limpiar cuando el componente desaparezca (buena práctica)
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Función para scroll suave a secciones ──────────────
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        background: scrolled
          ? "rgba(245, 237, 230, 0.97)" // Fondo sólido al hacer scroll
          : "rgba(245, 237, 230, 0.92)", // Un poco transparente al inicio
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #d6c4b8",
        transition: "all 0.35s ease",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        padding: "12px 0",
      }}
    >
      <Container>
        {/* ── Logo ────────────────────────────────────── */}
        <Navbar.Brand
          onClick={() => scrollTo("hero")}
          style={{ cursor: "pointer" }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "22px",
              fontWeight: 300,
              letterSpacing: "2px",
              color: "var(--text-dark)",
            }}
          >
            Eternal{" "}
            <em style={{ color: "var(--rose)", fontStyle: "italic" }}>
              Beauty
            </em>
          </span>
        </Navbar.Brand>

        {/* ── Botón hamburguesa (aparece en móvil) ────── */}
        {/* Bootstrap lo maneja automáticamente con expand="lg" */}
        <Navbar.Toggle
          aria-controls="nav-menu"
          style={{ border: "none", boxShadow: "none" }}
        />

        {/* ── Links del menú ──────────────────────────── */}
        <Navbar.Collapse id="nav-menu">
          <Nav className="ms-auto align-items-lg-center gap-lg-4">
            {[
              { label: "Nosotros", id: "about" },
              { label: "Servicios", id: "servicios" },
              { label: "Galería", id: "galeria" },
              { label: "Contacto", id: "contacto" },
            ].map((item) => (
              <Nav.Link
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  fontSize: "12px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text-mid)",
                  fontFamily: "var(--font-sans)",
                  transition: "color 0.3s ease",
                }}
                className="nav-link-custom"
              >
                {item.label}
              </Nav.Link>
            ))}

            {/* Botón CTA (Call to Action) */}
            <Button
              onClick={() => scrollTo("contacto")}
              style={{
                background: "var(--rose)",
                border: "none",
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "10px 24px",
                borderRadius: "2px",
                marginTop: "8px", // espacio en móvil
              }}
              className="mt-lg-0"
            >
              Reservar cita
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
