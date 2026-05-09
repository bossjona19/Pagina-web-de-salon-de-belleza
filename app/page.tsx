// ============================================================
// app/page.tsx
// ============================================================
// Esta es la página principal (la home).
// Solo importa y ordena los componentes.
// Cada sección tiene su propio componente en /components/
// ============================================================

// "use client" NO va aquí — page.tsx puede ser un Server Component
// Los componentes que necesitan interactividad lo declaran ellos mismos
// o están agrupados en ClientSections (wrapper con "use client").

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ClientSections from "@/components/ClientSections";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// ⚠️ Services, Gallery y ScrollAnimations NO se importan aquí —
// están dentro de ClientSections para evitar el error de event handlers.

export default function Home() {
  return (
    <>
      {/* Barra de navegación (fija en la parte superior) */}
      <Navbar />

      {/* Sección principal con título grande */}
      <Hero />

      {/* Sección "Sobre nosotros" */}
      <About />

      {/*
        ClientSections agrupa todos los componentes interactivos:
        Services (filtros + modal), Gallery y ScrollAnimations.
        Al tener "use client" en el wrapper, los event handlers
        (onClick, onMouseEnter, etc.) funcionan correctamente.
      */}
      <ClientSections />

      {/* Formulario de contacto y reserva */}
      <ContactSection />

      {/* Pie de página */}
      <Footer />
    </>
  );
}
