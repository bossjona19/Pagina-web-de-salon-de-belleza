"use client";

// ============================================================
// components/Hero.tsx
// ============================================================
// La sección principal que se ve al entrar al sitio.
// Tiene el título grande, subtítulo y botones de acción.
// Las animaciones están hechas con CSS (fadeInUp en globals.css).
// ============================================================

import { Container, Row, Col, Button } from "react-bootstrap";

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #fff 0%, var(--beige) 50%, var(--rose-pale) 100%)",
        display: "flex",
        alignItems: "center",
        paddingTop: "80px",    // Espacio para el navbar fijo
        paddingBottom: "60px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decoración de fondo — círculos difuminados sutiles */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,120,110,0.06) 0%, transparent 70%)",
          top: "-100px",
          right: "-150px",
          pointerEvents: "none",
        }}
      />

      <Container>
        <Row className="align-items-center">
          {/* ── Columna de texto ───────────────────────── */}
          <Col lg={7} className="text-center text-lg-start">

            {/* Eyebrow — texto pequeño sobre el título */}
            <p
              className="eyebrow mb-3"
              style={{
                animation: "fadeInUp 0.7s 0.1s both",
              }}
            >
              Estudio de Estética &amp; Spa · Panamá
            </p>

            {/* Título principal */}
            <h1
              style={{
                fontSize: "clamp(48px, 7vw, 88px)",
                lineHeight: 1.05,
                marginBottom: "24px",
                animation: "fadeInUp 0.7s 0.25s both",
              }}
            >
              Realza tu
              <br />
              <em style={{ color: "var(--rose)", fontStyle: "italic" }}>
                Belleza Natural
              </em>
            </h1>

            {/* Subtítulo */}
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-mid)",
                lineHeight: 1.85,
                maxWidth: "460px",
                marginBottom: "40px",
                fontWeight: 300,
                margin: "0 auto 40px",
                animation: "fadeInUp 0.7s 0.4s both",
              }}
              className="mx-lg-0"
            >
              Tratamientos personalizados diseñados para resaltar tu esencia.
              Porque la verdadera belleza merece atención experta.
            </p>

            {/* Botones de acción */}
            <div
              className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start"
              style={{ animation: "fadeInUp 0.7s 0.55s both" }}
            >
              <Button
                onClick={() => scrollTo("servicios")}
                style={{
                  background: "var(--rose)",
                  border: "none",
                  padding: "15px 36px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  transition: "var(--transition)",
                }}
              >
                Ver servicios
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => scrollTo("contacto")}
                style={{
                  border: "0.5px solid var(--text-dark)",
                  color: "var(--text-dark)",
                  padding: "15px 36px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  borderRadius: "2px",
                  background: "transparent",
                }}
              >
                Reservar cita
              </Button>
            </div>
          </Col>

          {/* ── Columna visual (solo visible en desktop) ── */}
          <Col lg={5} className="d-none d-lg-flex justify-content-center">
            <div style={{ position: "relative" }}>
              {/* Tarjeta de estadísticas verticales */}
              {[
                { num: "500+", label: "Clientas satisfechas" },
                { num: "8 años", label: "De experiencia" },
                { num: "100%", label: "Productos premium" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-3 mb-4"
                  style={{
                    animation: `fadeInUp 0.7s ${0.5 + i * 0.12}s both`,
                  }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "40px",
                      background: "var(--rose)",
                      borderRadius: "2px",
                      opacity: 0.7,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "36px",
                        fontWeight: 300,
                        color: "var(--rose)",
                        lineHeight: 1,
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: "var(--text-light)",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {/* Estadísticas en móvil (fila horizontal abajo) */}
        <Row className="d-lg-none mt-5 text-center g-4">
          {[
            { num: "500+", label: "Clientas satisfechas" },
            { num: "8", label: "Años de experiencia" },
            { num: "100%", label: "Productos premium" },
          ].map((stat, i) => (
            <Col xs={4} key={i}>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "28px",
                  color: "var(--rose)",
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "var(--text-light)",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
