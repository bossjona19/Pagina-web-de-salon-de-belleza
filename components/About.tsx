"use client";
// ============================================================
// components/About.tsx
// ============================================================

import { Container, Row, Col } from "react-bootstrap";

export default function About() {
  return (
    <section id="about" style={{ background: "var(--beige)" }}>
      <Container>
        <Row className="align-items-center g-5">
          {/* ── Visual (imagen + badge) ───────────────── */}
          <Col lg={5}>
            <div style={{ position: "relative" }}>
              {/* Contenedor de imagen principal */}
              <div
                style={{
                  width: "100%",
                  height: "420px",
                  background:
                    "linear-gradient(145deg, var(--rose-light), var(--rose))",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://png.pngtree.com/png-vector/20240607/ourmid/pngtree-gold-gradient-womens-hair-salon-logo-design-png-image_12617839.png"
                  alt="Eternal Beauty Studio"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Badge de valoración flotante */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "-16px",
                  background: "var(--white)",
                  border: "0.5px solid var(--beige-dark)",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  textAlign: "center",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "26px",
                    color: "var(--rose)",
                  }}
                >
                  ★ 4.9
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "var(--text-light)",
                    marginTop: "2px",
                  }}
                >
                  Valoración
                </div>
              </div>
            </div>
          </Col>

          {/* ── Contenido de texto ────────────────────── */}
          <Col lg={7}>
            <div className="fade-up">
              <p className="eyebrow">Sobre nosotros</p>
              <h2
                className="fade-up delay-1"
                style={{
                  fontSize: "clamp(36px, 4vw, 52px)",
                  marginBottom: "16px",
                }}
              >
                Arte &amp;{" "}
                <em style={{ color: "var(--rose)", fontStyle: "italic" }}>
                  cuidado
                </em>
                <br />
                en cada detalle
              </h2>
              <p
                className="fade-up delay-2"
                style={{
                  color: "var(--text-mid)",
                  lineHeight: 1.85,
                  fontSize: "15px",
                  marginBottom: "28px",
                }}
              >
                Con más de 8 años de experiencia, combinamos técnicas avanzadas
                con un trato cercano y personalizado. Cada cita es una
                experiencia diseñada para que te sientas y luzcas
                extraordinaria.
              </p>

              {/* Lista de características */}
              <div
                className="fade-up delay-3"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {[
                  "Técnicas certificadas internacionalmente y actualización constante",
                  "Productos premium de alta gama, libres de parabenos",
                  "Atención personalizada con cita previa para garantizar tu tiempo",
                ].map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--rose)",
                        marginTop: "8px",
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-mid)",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
