// ============================================================
// app/layout.tsx
// ============================================================
// El Layout es como el "marco" que rodea TODAS las páginas.
// Todo lo que pongas aquí aparece en cada página del sitio.
// Ideal para: navbar, footer, fuentes, Bootstrap, etc.
// ============================================================

import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import ToasterProvider from "@/components/ToasterProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

// ── Fuentes de Google (Next.js las descarga automáticamente) ──
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif", // Para usarla en CSS como var(--font-serif)
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

// ── SEO: Título y descripción para Google ──────────────────
export const metadata: Metadata = {
  title: "Eternal Beauty Studio | Salón de Belleza en Panamá",
  description:
    "Maquillaje profesional, faciales, cortes y tratamientos de belleza en Panamá. Reserva tu cita hoy.",
  keywords: [
    "salón de belleza",
    "panamá",
    "maquillaje",
    "faciales",
    "keratina",
  ],
  openGraph: {
    title: "Eternal Beauty Studio",
    description: "Estudio de estética y spa en Panamá",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        {/*
          children = el contenido de cada página (page.tsx).
        */}
        {children}

        {/*
          ToasterProvider = wrapper con "use client" que contiene
          el sistema de notificaciones de react-hot-toast.
          No puede ir directo aquí porque Toaster usa hooks internamente.
        */}
        <ToasterProvider />
      </body>
    </html>
  );
}
