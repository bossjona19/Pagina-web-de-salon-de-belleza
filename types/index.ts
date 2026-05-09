// ============================================================
// types/index.ts
// ============================================================
// Aquí definimos la "forma" de los datos que vamos a usar.
// TypeScript usa esto para avisarnos si cometemos un error.
// Ejemplo: si un servicio necesita "name" y olvidamos ponerlo,
// TypeScript nos avisa antes de que el usuario lo vea.
// ============================================================

/**
 * Un servicio del salón (corte, facial, manicura, etc.)
 */
export interface Service {
  id: number;
  name: string;           // "Keratina", "Corte de pelo"
  category: ServiceCategory; // "corte", "faciales", etc.
  price: string;          // "$65" (string porque puede ser "$65 - $90")
  description: string;    // Descripción larga del servicio
  duration: string;       // "90 min"
  img: string;            // URL de la imagen
  featured?: boolean;     // ¿Es un servicio destacado?
}

/**
 * Las categorías disponibles de servicios
 */
export type ServiceCategory =
  | "corte"
  | "faciales"
  | "uñas"
  | "tratamientos"
  | "maquillaje";

/**
 * Una reserva de cita hecha por una clienta
 */
export interface Appointment {
  id?: number;            // Lo asigna la base de datos automáticamente
  clientName: string;     // Nombre de la clienta
  phone: string;          // Teléfono de contacto
  service: string;        // Nombre del servicio que quiere
  date: string;           // Fecha preferida (ej: "2026-05-20")
  time: string;           // Hora preferida (ej: "10:00")
  message?: string;       // Mensaje adicional (opcional)
  status: AppointmentStatus; // Estado de la cita
  createdAt?: Date;       // Cuándo se creó la reserva
}

/**
 * Los posibles estados de una cita
 */
export type AppointmentStatus =
  | "pending"    // Esperando confirmación
  | "confirmed"  // Confirmada por la estilista
  | "completed"  // Ya se realizó
  | "cancelled"; // Cancelada

/**
 * Datos del formulario de contacto
 */
export interface ContactForm {
  name: string;
  phone: string;
  service: string;
  date?: string;
  time?: string;
  message?: string;
}

/**
 * Respuesta estándar de todas nuestras APIs
 * Así el frontend siempre sabe qué esperar
 */
export interface ApiResponse<T = unknown> {
  success: boolean;       // ¿Salió bien?
  data?: T;               // Los datos (si salió bien)
  error?: string;         // El mensaje de error (si falló)
  message?: string;       // Mensaje informativo
}

/**
 * Horas bloqueadas/ocupadas por fecha
 * Clave: fecha en formato "YYYY-MM-DD"
 * Valor: array de horas ocupadas ["10:00", "14:00"]
 */
export type BlockedHours = Record<string, string[]>;
