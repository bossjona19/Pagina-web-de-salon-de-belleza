"use client";

// ============================================================
// components/Services.tsx
// ============================================================
// Sección de servicios con:
// - Filtros por categoría (botones pill)
// - Grilla de tarjetas con animación
// - Modal de Bootstrap al hacer click en una tarjeta
// ============================================================

import { useState } from "react";
import { Container, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import { SERVICES, CATEGORIES } from "@/lib/data";
import { Service } from "@/types";

export default function Services() {
  // ── Estado ─────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // ── Servicios filtrados según la categoría activa ──────
  const filtered =
    activeCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  // ── Abrir/cerrar modal ─────────────────────────────────
  const openModal = (service: Service) => setSelectedService(service);
  const closeModal = () => setSelectedService(null);

  // ── Ir al formulario con el servicio preseleccionado ───
  const reservar = (serviceName: string) => {
    closeModal();
    // Scroll al formulario
    setTimeout(() => {
      document
        .getElementById("contacto")
        ?.scrollIntoView({ behavior: "smooth" });
      // Seleccionar el servicio en el dropdown
      const select = document.getElementById("fservice") as HTMLSelectElement;
      if (select) select.value = serviceName;
    }, 300);
  };

  const openWhatsApp = (serviceName: string) => {
    const msg = encodeURIComponent(
      `Hola! Me gustaría reservar una cita para ${serviceName} en Eternal Beauty Studio 💅`,
    );
    window.open(`https://wa.me/50765991047?text=${msg}`, "_blank");
  };

  return (
    <section id="servicios" style={{ background: "var(--white)" }}>
      <Container>
        {/* ── Encabezado ─────────────────────────────── */}
        <div className="text-center mb-5 fade-up">
          <p className="eyebrow">Lo que ofrecemos</p>
          <h2
            style={{
              fontSize: "clamp(36px, 4vw, 56px)",
              marginBottom: "16px",
            }}
          >
            Servicios{" "}
            <em style={{ color: "var(--rose)", fontStyle: "italic" }}>
              exclusivos
            </em>
          </h2>
          <p
            style={{
              color: "var(--text-mid)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Cada tratamiento es una experiencia cuidadosamente diseñada para ti.
          </p>
        </div>

        {/* ── Filtros por categoría ───────────────────── */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background:
                  activeCategory === cat.id ? "var(--rose)" : "transparent",
                color:
                  activeCategory === cat.id
                    ? "var(--white)"
                    : "var(--text-mid)",
                border: `0.5px solid ${activeCategory === cat.id ? "var(--rose)" : "var(--beige-dark)"}`,
                borderRadius: "50px",
                padding: "8px 22px",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                transition: "var(--transition)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Grilla de tarjetas ──────────────────────── */}
        <Row className="g-4">
          {filtered.map((service, i) => (
            <Col key={service.id} xs={12} sm={6} lg={4} xl={3}>
              <ServiceCard
                service={service}
                delay={i * 80}
                onClick={() => openModal(service)}
              />
            </Col>
          ))}
        </Row>
      </Container>

      {/* ── Modal de detalle (Bootstrap Modal) ─────────── */}
      {/* Bootstrap maneja la animación, el backdrop y el cierre con ESC */}
      <Modal show={!!selectedService} onHide={closeModal} size="lg" centered>
        {selectedService && (
          <>
            <Modal.Header
              closeButton
              style={{ border: "none", padding: "20px 24px 0" }}
            >
              <Badge
                style={{
                  background: "var(--rose-pale)",
                  color: "var(--rose-dark)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  padding: "6px 12px",
                }}
              >
                {selectedService.category} · {selectedService.duration}
              </Badge>
            </Modal.Header>

            <Modal.Body style={{ padding: "0" }}>
              {/* Imagen del servicio */}
              <div
                style={{
                  height: "280px",
                  overflow: "hidden",
                  margin: "16px 24px",
                  borderRadius: "8px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedService.img}
                  alt={selectedService.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Contenido */}
              <div style={{ padding: "8px 24px 24px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "32px",
                    fontWeight: 300,
                    marginBottom: "12px",
                  }}
                >
                  {selectedService.name}
                </h3>
                <p
                  style={{
                    color: "var(--text-mid)",
                    lineHeight: 1.85,
                    fontSize: "14px",
                  }}
                >
                  {selectedService.description}
                </p>
              </div>
            </Modal.Body>

            {/* Footer con precio y botones */}
            <Modal.Footer
              style={{
                borderTop: "0.5px solid var(--beige-dark)",
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "36px",
                  fontWeight: 300,
                  color: "var(--rose)",
                }}
              >
                {selectedService.price}
              </span>

              <div className="d-flex gap-2">
                <Button
                  onClick={() => reservar(selectedService.name)}
                  style={{
                    background: "var(--rose)",
                    border: "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "12px 24px",
                    borderRadius: "2px",
                  }}
                >
                  Reservar
                </Button>

                <Button
                  onClick={() => openWhatsApp(selectedService.name)}
                  style={{
                    background: "#25D366",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "2px",
                    fontSize: "16px",
                  }}
                  title="Escribir por WhatsApp"
                >
                  💬
                </Button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </section>
  );
}

// ── Subcomponente: tarjeta de servicio individual ──────────
// Lo ponemos aquí porque solo se usa en Services.tsx
function ServiceCard({
  service,
  delay,
  onClick,
}: {
  service: Service;
  delay: number;
  onClick: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className="h-100"
      style={{
        background: "var(--white)",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "var(--shadow-sm)",
        transition: "var(--transition)",
        animationDelay: `${delay}ms`,
        animation: "fadeInUp 0.5s both",
        border: "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-6px)";
        el.style.boxShadow = "var(--shadow-lg)";
        el.style.borderColor = "var(--rose-light)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "transparent";
      }}
    >
      {/* Imagen con etiqueta de categoría */}
      <div
        style={{ height: "200px", position: "relative", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.img}
          alt={service.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Badge de categoría encima de la imagen */}
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "rgba(255,255,255,0.92)",
            color: "var(--rose-dark)",
            fontSize: "9px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: "50px",
            fontFamily: "var(--font-sans)",
          }}
        >
          {service.category}
        </span>
      </div>

      {/* Contenido */}
      <div style={{ padding: "20px" }}>
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "22px",
            fontWeight: 400,
            marginBottom: "8px",
          }}
        >
          {service.name}
        </h3>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-light)",
            lineHeight: 1.7,
            marginBottom: "16px",
          }}
        >
          {service.description.substring(0, 75)}...
        </p>

        {/* Footer de la tarjeta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "0.5px solid var(--beige-dark)",
            paddingTop: "14px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "26px",
              fontWeight: 300,
              color: "var(--rose)",
            }}
          >
            {service.price}
          </span>

          <span
            style={{
              fontSize: "10px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--rose)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Ver detalle →
          </span>
        </div>
      </div>
    </article>
  );
}
