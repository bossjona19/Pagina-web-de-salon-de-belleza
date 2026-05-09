# 💅 Eternal Beauty Studio — Guía del Proyecto

## ¿Qué es este proyecto?
Es el sitio web de un salón de belleza hecho en **Next.js 14**.
Next.js es como React pero con superpoderes: maneja tanto el front-end (lo que ve el cliente)
como el back-end (las APIs que conectan con la base de datos), todo en una sola carpeta.

---

## 📦 Paso 1 — Instalar Node.js

Antes de todo necesitas tener Node.js en tu computadora.
Node.js es el motor que corre JavaScript fuera del navegador.

1. Entra a https://nodejs.org
2. Descarga la versión **LTS** (la que dice "Recommended")
3. Instálala con los pasos por defecto
4. Para verificar que quedó instalado, abre la terminal y escribe:

```bash
node -v
# Debe salir algo como: v20.11.0

npm -v
# Debe salir algo como: 10.2.4
```

---

## 🚀 Paso 2 — Crear el proyecto

Abre la terminal en la carpeta donde quieras guardar el proyecto y corre:

```bash
npx create-next-app@latest eternal-beauty
```

Te va a preguntar varias cosas. Responde así:

```
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use the `src/` directory? → No
✔ Would you like to use App Router? → Yes
✔ Would you like to customize the default import alias? → No
```

Luego entra a la carpeta:

```bash
cd eternal-beauty
```

---

## 📚 Paso 3 — Instalar las librerías extra

Estas son las herramientas adicionales que vamos a usar:

```bash
# Bootstrap 5 — para componentes visuales bonitos (modales, alertas, etc.)
npm install bootstrap

# React Bootstrap — para usar Bootstrap de forma "React-friendly"
npm install react-bootstrap

# React Hook Form — para validar formularios de forma sencilla
npm install react-hook-form

# Axios — para hacer llamadas a las APIs de forma más fácil
npm install axios

# Prisma — para conectar con la base de datos (lo usamos después)
npm install prisma @prisma/client

# React Hot Toast — para mostrar notificaciones bonitas
npm install react-hot-toast
```

---

## ▶️ Paso 4 — Correr el proyecto

```bash
npm run dev
```

Abre tu navegador en: http://localhost:3000

Cada vez que guardes un archivo, la página se actualiza automáticamente.

---

## 📁 ¿Qué hace cada carpeta?

```
eternal-beauty/
│
├── app/                    ← Aquí viven las páginas y las APIs
│   ├── layout.tsx          ← Plantilla base (navbar + footer siempre visibles)
│   ├── page.tsx            ← La página principal (el home)
│   ├── globals.css         ← Estilos globales
│   └── api/                ← Las APIs (conexión con base de datos)
│       ├── appointments/   ← API para manejar las reservas
│       ├── services/       ← API para los servicios del salón
│       └── contact/        ← API para el formulario de contacto
│
├── components/             ← Piezas de UI reutilizables
│   ├── Navbar.tsx          ← La barra de navegación
│   ├── Hero.tsx            ← La sección principal con el título grande
│   ├── About.tsx           ← La sección "Nosotros"
│   ├── Services.tsx        ← La sección de servicios con filtros
│   ├── ServiceCard.tsx     ← Una tarjeta individual de servicio
│   ├── ServiceModal.tsx    ← El modal que abre al hacer click en un servicio
│   ├── Gallery.tsx         ← La galería de antes/después
│   ├── BeforeAfter.tsx     ← El slider de comparación
│   ├── BookingForm.tsx     ← El formulario de reserva
│   ├── ContactSection.tsx  ← La sección de contacto completa
│   └── Footer.tsx          ← El pie de página
│
├── lib/                    ← Lógica interna (no la ve el usuario)
│   ├── db.ts               ← Conexión a la base de datos
│   ├── whatsapp.ts         ← Helper para armar mensajes de WhatsApp
│   └── validations.ts      ← Reglas de validación de formularios
│
├── types/                  ← Definición de tipos de datos (TypeScript)
│   └── index.ts            ← Tipos: Servicio, Reserva, Contacto...
│
├── public/                 ← Imágenes, logos, fotos (archivos estáticos)
│   └── img/                ← Fotos de antes/después, del estudio, etc.
│
├── .env.local              ← Variables secretas (contraseñas de BD, etc.) NUNCA subir a GitHub
├── package.json            ← Lista de librerías instaladas
├── next.config.ts          ← Configuración de Next.js
└── tailwind.config.ts      ← Configuración de colores y estilos
```

---

## 🌐 ¿Cómo funcionan las APIs?

Una API es un "puente" entre el frontend (lo que ve el usuario) y la base de datos.

Ejemplo de flujo para una reserva:

```
Usuario llena el formulario
    ↓
BookingForm.tsx lo envía a la API
    ↓
app/api/appointments/route.ts lo recibe
    ↓
lib/db.ts lo guarda en la base de datos
    ↓
La API responde "éxito" o "error"
    ↓
El formulario muestra una notificación al usuario
```

---

## 💬 WhatsApp Integration

El sitio tiene doble sistema:
1. **Formulario web** → guarda en base de datos + notificación a la dueña
2. **Botón de WhatsApp** → abre WhatsApp directo con mensaje pre-armado

Número configurado: +507 6599 1047
