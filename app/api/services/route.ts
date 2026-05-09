// ============================================================
// app/api/services/route.ts
// ============================================================
// API para consultar los servicios del salón.
// En el futuro, los servicios vendrán de la base de datos.
// Por ahora usamos los datos del archivo lib/data.ts
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { SERVICES } from "@/lib/data";
import { ApiResponse, Service } from "@/types";

/**
 * GET /api/services
 * Devuelve la lista de servicios.
 * Se puede filtrar por categoría con ?category=corte
 *
 * Ejemplos:
 * /api/services             → todos los servicios
 * /api/services?category=faciales → solo los faciales
 * /api/services?featured=true  → solo los destacados
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featuredOnly = searchParams.get("featured") === "true";

    let services = [...SERVICES];

    // Filtrar por categoría si se envió el parámetro
    if (category && category !== "all") {
      services = services.filter((s) => s.category === category);
    }

    // Filtrar solo los destacados si se pidió
    if (featuredOnly) {
      services = services.filter((s) => s.featured);
    }

    return NextResponse.json<ApiResponse<Service[]>>({
      success: true,
      data: services,
    });

  } catch (error) {
    console.error("❌ Error al consultar servicios:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
