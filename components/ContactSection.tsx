"use client";
// ============================================================
// components/ContactSection.tsx
// ============================================================
// La sección de contacto y reservas.
// Une la info de contacto (izquierda) con el formulario (derecha).
// ============================================================

import { Container, Row, Col } from "react-bootstrap";
import BookingForm from "./BookingForm";
import { buildGeneralWhatsApp } from "@/lib/whatsapp";

export default function ContactSection() {
  return (
    <section id="contacto" style={{ background: "var(--white)" }}>
      <Container>
        <Row className="g-5 align-items-start">
          {/* ── Info de contacto (izquierda) ─────────── */}
          <Col lg={5}>
            <div className="fade-up">
              <p className="eyebrow">Agenda tu cita</p>
              <h2
                className="fade-up delay-1"
                style={{
                  fontSize: "clamp(36px, 4vw, 52px)",
                  marginBottom: "16px",
                }}
              >
                Hablemos{" "}
                <em style={{ color: "var(--rose)", fontStyle: "italic" }}>
                  pronto
                </em>
              </h2>

              <p
                className="fade-up delay-2"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "19px",
                  fontStyle: "italic",
                  color: "var(--text-mid)",
                  lineHeight: 1.6,
                  margin: "24px 0 36px",
                }}
              >
                &ldquo;Cada visita es el comienzo de una transformación que
                llevarás contigo.&rdquo;
              </p>

              {/* Items de contacto */}
              <div
                className="fade-up delay-3"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {[
                  {
                    icon: "📍",
                    title: "Ubicación",
                    value: "Panamá, República de Panamá",
                  },
                  {
                    icon: "🕐",
                    title: "Horario",
                    value: "Lunes a Sábado · 9:00am – 7:00pm",
                  },
                  { icon: "💬", title: "WhatsApp", value: "+507 6599 1047" },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        background: "var(--rose-pale)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          color: "var(--text-light)",
                          marginBottom: "4px",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--text-dark)",
                          fontWeight: 300,
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón de WhatsApp directo */}
              <button
                onClick={() => window.open(buildGeneralWhatsApp(), "_blank")}
                style={{
                  marginTop: "32px",
                  background: "#25D366",
                  color: "white",
                  border: "none",
                  padding: "14px 28px",
                  borderRadius: "2px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "var(--transition)",
                }}
              >
                💬 Escribir por WhatsApp
              </button>
            </div>
          </Col>

          {/* ── Formulario (derecha) ──────────────────── */}
          <Col lg={7} className="fade-up delay-2">
            <BookingForm />
          </Col>
        </Row>
      </Container>
    </section>
  );
}
