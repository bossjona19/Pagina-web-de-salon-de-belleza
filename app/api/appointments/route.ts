// ============================================================
// app/api/appointments/route.ts
// ============================================================
// Esta es la API que recibe las reservas del formulario.
//
// ¿Qué es una API route en Next.js?
// Es una URL especial que solo el servidor puede ver.
// El frontend le manda datos y esta función los procesa.
//
// URL de esta API: /api/appointments
// Métodos: GET (consultar) y POST (crear nueva reserva)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, Appointment } from "@/types";
// import prisma from "@/lib/db"; // ← Descomentar cuando tengas BD

/**
 * POST /api/appointments
 * Crea una nueva reserva de cita.
 *
 * El formulario le manda estos datos:
 * { clientName, phone, service, date, time, message }
 *
 * Esta función:
 * 1. Valida que los datos estén completos
 * 2. Los guarda en la base de datos
 * 3. Responde con éxito o error
 */
export async function POST(request: NextRequest) {
  try {
    // Leer los datos que mandó el formulario
    const body = await request.json();
    const { clientName, phone, service, date, time, message } = body;

    // ── Validaciones básicas ──────────────────────────────
    // Si falta algún campo requerido, respondemos con error 400
    if (!clientName || !phone || !service) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Nombre, teléfono y servicio son obligatorios",
        },
        { status: 400 }
      );
    }

    // Validar que el teléfono tenga un formato válido (mínimo 7 dígitos)
    const phoneClean = phone.replace(/\D/g, ""); // quitar todo lo que no sea número
    if (phoneClean.length < 7) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Teléfono no válido" },
        { status: 400 }
      );
    }

    // ── Guardar en base de datos ──────────────────────────
    // Por ahora simulamos el guardado (cuando tengas BD, usa Prisma)
    //
    // Con Prisma sería así:
    // const appointment = await prisma.appointment.create({
    //   data: {
    //     clientName,
    //     phone,
    //     service,
    //     date: date || null,
    //     time: time || null,
    //     message: message || null,
    //     status: "pending",
    //   },
    // });

    // Simulación por ahora:
    const appointment: Appointment = {
      id: Date.now(), // ID temporal
      clientName,
      phone,
      service,
      date: date || "",
      time: time || "",
      message: message || "",
      status: "pending",
      createdAt: new Date(),
    };

    console.log("✅ Nueva reserva:", appointment);

    // ── Respuesta exitosa ─────────────────────────────────
    return NextResponse.json<ApiResponse<Appointment>>({
      success: true,
      data: appointment,
      message: "¡Reserva recibida! Te contactaremos pronto para confirmar.",
    });

  } catch (error) {
    // Si algo sale mal inesperadamente, lo registramos y respondemos
    console.error("❌ Error al crear reserva:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/appointments
 * Consulta todas las reservas.
 * En el futuro esto será para el panel de administración de la dueña.
 */
export async function GET() {
  try {
    // Con Prisma sería:
    // const appointments = await prisma.appointment.findMany({
    //   orderBy: { createdAt: "desc" },
    // });

    // Simulación:
    const appointments: Appointment[] = [];

    return NextResponse.json<ApiResponse<Appointment[]>>({
      success: true,
      data: appointments,
    });

  } catch (error) {
    console.error("❌ Error al consultar reservas:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
