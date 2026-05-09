// ============================================================
// lib/whatsapp.ts
// ============================================================
// Este archivo arma los mensajes de WhatsApp de forma ordenada.
// Así no tenemos que escribir el mismo texto en varios lugares.
// ============================================================

import { ContactForm } from "@/types";

// Número de WhatsApp de la dueña del salón (con código de país)
const WHATSAPP_NUMBER = "50765991047";

/**
 * Genera el enlace de WhatsApp para una reserva de cita.
 * Cuando se llama desde el navegador, abre WhatsApp automáticamente.
 */
export function buildAppointmentWhatsApp(form: ContactForm): string {
  const message = `Hola! Quiero reservar una cita en Eternal Beauty Studio 💅

*Nombre:* ${form.name}
*Teléfono:* ${form.phone}
*Servicio:* ${form.service}
*Fecha preferida:* ${form.date || "Flexible"}
*Hora preferida:* ${form.time || "Flexible"}
${form.message ? `*Mensaje:* ${form.message}` : ""}

¡Gracias! 🌸`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Genera el enlace de WhatsApp para consulta general.
 */
export function buildGeneralWhatsApp(): string {
  const message = "Hola! Me gustaría obtener más información sobre los servicios de Eternal Beauty Studio 💅";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
