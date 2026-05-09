// ============================================================
// lib/data.ts
// ============================================================
// Aquí guardamos los datos de los servicios.
// Por ahora están "hardcodeados" (escritos aquí directamente).
// Cuando tengamos base de datos, los vamos a leer de allá.
// ============================================================

import { Service, BlockedHours } from "@/types";

export const SERVICES: Service[] = [
  {
    id: 1,
    name: "Corte de cabello",
    category: "corte",
    img: "https://www.shutterstock.com/image-photo/salon-job-hair-stylist-braids-260nw-2317955141.jpg",
    price: "$65",
    description: "Corte personalizado según tu tipo de cabello y morfología facial. Incluye lavado, corte con tijera o navaja, y secado con blow-out.",
    duration: "90 min",
    featured: true,
  },
  {
    id: 2,
    name: "Keratina brasileña",
    category: "tratamientos",
    img: "https://directoriotierrasaltas.com/wp-content/uploads/2020/06/directorio-tierras-altas-keratinas-eva4-1200x1200.jpg",
    price: "$120",
    description: "Tratamiento de alisado y nutrición profunda con proteínas de keratina. Elimina el frizz, reduce el volumen y deja el cabello sedoso por hasta 3 meses.",
    duration: "120 min",
    featured: true,
  },
  {
    id: 3,
    name: "Pedicura completa",
    category: "uñas",
    img: "https://www.telebelleza.es/img/cms/manicura_pedicura_pagina.jpg",
    price: "$55",
    description: "Exfoliación, hidratación profunda, limado, cutículas y esmaltado en gel o regular. Tus pies merecen el mejor cuidado.",
    duration: "75 min",
  },
  {
    id: 4,
    name: "Facial hidratante",
    category: "faciales",
    img: "https://lulabeauty.co/cdn/shop/files/Complementarias_lapices_cejas_Mesa_de_trabajo_1_copia_16.jpg",
    price: "$70",
    description: "Limpieza profunda, exfoliación suave y mascarilla hidratante con ácido hialurónico. Ideal para piel seca o deshidratada. Efecto luminoso inmediato.",
    duration: "60 min",
    featured: true,
  },
  {
    id: 5,
    name: "Manicura en gel",
    category: "uñas",
    img: "https://media.glamour.mx/photos/61f055d8e95d4d02a8681c4f/16:9/w_2256,h_1269,c_limit/disen%CC%83osdeun%CC%83asblancoynegro.jpg",
    price: "$35",
    description: "Preparación de cutículas, hidratación de manos, limado y esmaltado en gel de larga duración. Hasta 3 semanas sin retoques.",
    duration: "45 min",
  },
  {
    id: 6,
    name: "Tinte de cabello",
    category: "tratamientos",
    img: "https://img.freepik.com/foto-gratis/mujer-lavando-su-cabello-salon-belleza_23-2149167387.jpg",
    price: "$180",
    description: "Coloración profesional con productos premium, sin amoníaco disponible. Incluye consulta de color, aplicación y tratamiento post-color para proteger el cabello.",
    duration: "150 min",
  },
  {
    id: 7,
    name: "Corte de puntas",
    category: "corte",
    img: "https://e00-telva.uecdn.es/assets/multimedia/imagenes/2020/01/28/15802411454678.jpg",
    price: "$50",
    description: "Corte de mantenimiento para eliminar las puntas abiertas y darle vida al cabello. Incluye lavado y secado básico.",
    duration: "60 min",
  },
  {
    id: 8,
    name: "Spa de pies premium",
    category: "tratamientos",
    img: "https://inesbe.com/wp-content/smush-webp/2024/04/woman-enjoying-pedicure-spa-treatment-at-a-beauty-2023-11-27-05-24-21-utc-1-1-1024x683.jpg.webp",
    price: "$90",
    description: "Tratamiento completo de baño en sales, exfoliación, masaje relajante, hidratación con mascarilla caliente y esmaltado. Una experiencia de spa completa.",
    duration: "90 min",
  },
];

/**
 * Categorías para los filtros de la sección de servicios
 */
export const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "corte", label: "Corte" },
  { id: "faciales", label: "Faciales" },
  { id: "uñas", label: "Uñas" },
  { id: "tratamientos", label: "Tratamientos" },
] as const;

/**
 * Horas ocupadas por fecha.
 * Cuando tengamos base de datos, esto vendrá de allá.
 * Formato de fecha: "YYYY-MM-DD"
 */
export const BLOCKED_HOURS: BlockedHours = {
  "2026-05-19": ["13:00", "16:00"],
  "2026-05-20": ["10:00", "15:00"],
};

/**
 * Genera la lista de horas disponibles (9am a 6pm)
 * para una fecha específica, marcando las ocupadas.
 */
export function getAvailableHours(date: string) {
  const blocked = BLOCKED_HOURS[date] || [];
  const hours = [];

  for (let h = 9; h <= 18; h++) {
    const time = `${h.toString().padStart(2, "0")}:00`;
    hours.push({
      value: time,
      label: time,
      available: !blocked.includes(time),
    });
  }

  return hours;
}
