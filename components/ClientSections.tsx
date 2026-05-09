"use client";

import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import ScrollAnimations from "@/components/ScrollAnimations";

// Agrupa todos los componentes que usan event handlers o hooks.
// "use client" aquí crea el boundary — todo lo que se renderice
// dentro puede tener onClick, useState, useEffect, etc.
export default function ClientSections() {
  return (
    <>
      <Services />
      <Gallery />
      <ScrollAnimations />
    </>
  );
}
