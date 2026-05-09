"use client";
// ============================================================
// components/Gallery.tsx
// ============================================================
// Galería de trabajos con sliders antes/después.
// Usa el componente BeforeAfter que ya hicimos.
// ============================================================

import { Container, Row, Col } from "react-bootstrap";
import BeforeAfter from "./BeforeAfter";

import img1 from "../public/img/1.jpeg";
import img2 from "../public/img/2.jpeg";
import img3 from "../public/img/3.jpeg";
import img4 from "../public/img/4.jpeg";
// Pares de imágenes para la galería
// Cuando tengas tus propias fotos, cámbialas aquí
// o ponlas en la carpeta /public/img/
const GALLERY_PAIRS = [
  {
    id: 1,
    before: img1.src,
    after: img2.src,
    label: "Tratamiento capilar",
  },
  {
    id: 2,
    before: img4.src,
    after: img3.src,
    label: "Coloración",
  },
];

export default function Gallery() {
  return (
    <section id="galeria" style={{ background: "var(--beige)" }}>
      <Container>
        {/* Encabezado */}
        <div className="mb-5 fade-up">
          <p className="eyebrow">Portfolio</p>
          <h2
            style={{
              fontSize: "clamp(42px, 6vw, 76px)",
              lineHeight: 1.1,
            }}
          >
            Mi{" "}
            <em style={{ color: "var(--rose)", fontStyle: "italic" }}>
              Trabajo
            </em>
          </h2>
          <p
            style={{
              color: "var(--text-mid)",
              fontSize: "14px",
              marginTop: "12px",
            }}
          >
            Arrastra el handle para comparar el antes y el después.
          </p>
        </div>

        {/* Grilla de sliders */}
        <Row className="g-4">
          {GALLERY_PAIRS.map((pair) => (
            <Col key={pair.id} xs={12} md={6}>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text-light)",
                  marginBottom: "12px",
                }}
              >
                {pair.label}
              </p>
              <BeforeAfter beforeSrc={pair.before} afterSrc={pair.after} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
