"use client";

// ============================================================
// components/BookingForm.tsx
// ============================================================
// Formulario de reserva de cita con:
// - Validación con React Hook Form
// - Alertas de Bootstrap (en lugar de alerts del browser)
// - Integración con la API /api/appointments
// - Botón directo a WhatsApp
// ============================================================

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { ContactForm } from "@/types";
import { SERVICES } from "@/lib/data";
import { getAvailableHours } from "@/lib/data";
import { buildAppointmentWhatsApp } from "@/lib/whatsapp";

export default function BookingForm() {
  // ── Estado ─────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // ── React Hook Form ────────────────────────────────────
  // register: conecta el input con el formulario
  // handleSubmit: valida todo antes de llamar a onSubmit
  // formState.errors: contiene los errores de validación
  // reset: limpia el formulario
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactForm>();

  // Observar el campo servicio para el link de WhatsApp
  const watchedService = watch("service", "");

  // ── Horas disponibles según la fecha seleccionada ──────
  const availableHours = getAvailableHours(selectedDate);

  // ── Enviar el formulario ───────────────────────────────
  const onSubmit = async (data: ContactForm) => {
    setLoading(true);

    try {
      // Llamar a nuestra API (Next.js route handler)
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: data.name,
          phone: data.phone,
          service: data.service,
          date: data.date || "",
          time: data.time || "",
          message: data.message || "",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // ✅ Todo bien — abrir WhatsApp + mostrar éxito
        setSuccess(true);
        reset(); // Limpiar el formulario

        // Abrir WhatsApp con los datos pre-rellenados
        const waLink = buildAppointmentWhatsApp(data);
        window.open(waLink, "_blank");

        toast.success("¡Reserva enviada! Te contactaremos pronto 💅");

        // Ocultar el mensaje de éxito después de 5 segundos
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error(result.error || "Algo salió mal, intenta de nuevo");
      }
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Abrir WhatsApp directo (sin formulario) ────────────
  const openWhatsApp = () => {
    const formData: ContactForm = {
      name: "",
      phone: "",
      service: watchedService,
    };
    window.open(buildAppointmentWhatsApp(formData), "_blank");
  };

  // ── Fecha mínima = hoy ─────────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: "12px",
        padding: "36px",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "28px",
          fontWeight: 300,
          marginBottom: "28px",
        }}
      >
        Reservar una cita
      </h3>

      {/* ── Alerta de éxito (Bootstrap Alert) ───────── */}
      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccess(false)}
          style={{
            background: "rgba(201, 120, 110, 0.08)",
            borderColor: "var(--rose-light)",
            color: "var(--text-mid)",
            fontSize: "14px",
          }}
        >
          ✨ ¡Solicitud enviada! Abrimos WhatsApp para confirmar tu cita. Te
          contactaremos pronto.
        </Alert>
      )}

      {/* ── Formulario ────────────────────────────────── */}
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Nombre y Teléfono en la misma fila */}
        <Row className="g-3 mb-3">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text-light)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Nombre *
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Tu nombre completo"
                isInvalid={!!errors.name}
                {...register("name", {
                  required: "Por favor ingresa tu nombre",
                  minLength: { value: 2, message: "Nombre muy corto" },
                })}
                style={{ fontSize: "14px", fontWeight: 300 }}
              />
              {/* Bootstrap maneja el estilo del error automáticamente */}
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text-light)",
                }}
              >
                Teléfono *
              </Form.Label>
              {/* InputGroup para poner el ícono de bandera */}
              <InputGroup>
                <InputGroup.Text style={{ fontSize: "16px" }}>
                  🇵🇦
                </InputGroup.Text>
                <Form.Control
                  type="tel"
                  placeholder="+507 6000 0000"
                  isInvalid={!!errors.phone}
                  {...register("phone", {
                    required: "Ingresa tu teléfono",
                    pattern: {
                      value: /^[\d\s\+\-\(\)]{7,}$/,
                      message: "Teléfono no válido",
                    },
                  })}
                  style={{ fontSize: "14px", fontWeight: 300 }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        {/* Selector de servicio */}
        <Form.Group className="mb-3">
          <Form.Label
            style={{
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--text-light)",
            }}
          >
            Servicio *
          </Form.Label>
          <Form.Select
            isInvalid={!!errors.service}
            {...register("service", { required: "Selecciona un servicio" })}
            style={{ fontSize: "14px", fontWeight: 300 }}
          >
            <option value="">Selecciona un servicio</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} — {s.price}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.service?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Fecha y hora en la misma fila */}
        <Row className="g-3 mb-3">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text-light)",
                }}
              >
                Fecha preferida
              </Form.Label>
              <Form.Control
                type="date"
                min={today}
                {...register("date")}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ fontSize: "14px" }}
              />
            </Form.Group>
          </Col>

          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--text-light)",
                }}
              >
                Hora
              </Form.Label>
              <Form.Select {...register("time")} style={{ fontSize: "14px" }}>
                <option value="">Selecciona una hora</option>
                {availableHours.map((h) => (
                  <option key={h.value} value={h.value} disabled={!h.available}>
                    {h.label} {!h.available ? "(ocupado)" : ""}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Mensaje opcional */}
        <Form.Group className="mb-4">
          <Form.Label
            style={{
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--text-light)",
            }}
          >
            Mensaje (opcional)
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Cuéntanos qué necesitas..."
            {...register("message")}
            style={{ fontSize: "14px", fontWeight: 300, resize: "vertical" }}
          />
        </Form.Group>

        {/* Botones de acción */}
        <div className="d-flex gap-2">
          {/* Botón principal — envía el formulario */}
          <Button
            type="submit"
            disabled={loading}
            className="flex-grow-1"
            style={{
              background: "var(--rose)",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "14px",
              borderRadius: "2px",
            }}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enviando...
              </>
            ) : (
              "Enviar solicitud"
            )}
          </Button>

          {/* Botón de WhatsApp directo */}
          <Button
            type="button"
            onClick={openWhatsApp}
            title="Escribir directamente por WhatsApp"
            style={{
              background: "#25D366",
              border: "none",
              padding: "14px 18px",
              borderRadius: "2px",
              fontSize: "18px",
            }}
          >
            💬
          </Button>
        </div>

        <p
          style={{
            fontSize: "11px",
            color: "var(--text-light)",
            marginTop: "12px",
            textAlign: "center",
          }}
        >
          Al enviar, abriremos WhatsApp para confirmar tu cita directamente.
        </p>
      </Form>
    </div>
  );
}
