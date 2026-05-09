// ============================================================
// app/api/contact/route.ts
// ============================================================
// API para el formulario de contacto general.
// Similar a appointments pero más simple (sin fecha/hora).
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types";

/**
 * POST /api/contact
 * Recibe un mensaje de contacto del formulario.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, service, message } = body;

    // Validaciones
    if (!name || !phone) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nombre y teléfono son obligatorios" },
        { status: 400 }
      );
    }

    // En el futuro: enviar email/notificación a la dueña
    // await sendEmailNotification({ name, phone, service, message });

    console.log("📩 Nuevo mensaje de contacto:", { name, phone, service, message });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Mensaje recibido. Te contactaremos pronto 💅",
    });

  } catch (error) {
    console.error("❌ Error en contacto:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
