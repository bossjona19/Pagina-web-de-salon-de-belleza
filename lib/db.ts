// ============================================================
// lib/db.ts
// ============================================================
// Este archivo maneja la conexión a la base de datos usando Prisma.
// Prisma es como un "traductor" que nos permite hablar con la BD
// usando JavaScript en lugar de SQL crudo.
//
// IMPORTANTE: Antes de usar esto necesitas:
// 1. Correr: npx prisma init
// 2. Configurar DATABASE_URL en .env.local
// 3. Correr: npx prisma db push
// ============================================================

import { PrismaClient } from "@prisma/client";

/**
 * En desarrollo, Next.js reinicia el servidor muy seguido.
 * Sin este truco, se crearían demasiadas conexiones a la BD.
 * Esta es la solución oficial recomendada por Prisma.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // En desarrollo, muestra las queries en la terminal
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

// ============================================================
// NOTA PARA TU HERMANO:
// Cuando veas `prisma.appointment.create(...)` en las APIs,
// eso le dice a Prisma: "guarda esto en la tabla 'appointment'".
// Prisma se encarga de hablar con la base de datos por nosotros.
// ============================================================
