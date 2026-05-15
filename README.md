# Eternal Beauty Studio — MVP

Sitio web + panel de administración para salones de belleza.
Stack: HTML · CSS · JavaScript Vanilla · Firebase (Auth + Firestore)

---

## Estructura de archivos

```
/
├── index.html                → Sitio principal (clientes)
├── admin2341.html            → Panel admin (servido en /admin2341)
├── vercel.json               → Config Vercel: cleanUrls (sin .html)
├── styles.css                → Estilos principales
├── admin.css                 → Estilos del panel admin
├── firebase-config.js        → ⚠️ Configuración Firebase (editar)
├── app.js                    → Lógica del sitio principal
├── Admin.js                  → Lógica del panel admin
├── Calendar.js               → Integración Google Calendar
└── img/                      → Fotos del before/after
    ├── 1.jpeg
    ├── 2.jpeg
    ├── 3.jpeg
    └── 4.jpeg
```

---

## Acceso al panel admin

**No hay login con usuario/contraseña.** El acceso es por **URL "secreta"**:

```
https://tu-sitio.com/admin2341
```

(En Vercel, gracias a `cleanUrls: true` en `vercel.json`, el archivo
`admin2341.html` se sirve sin la extensión `.html`.)

Cualquiera que conozca esta URL tiene acceso total al panel. Si necesitas
cambiar el slug, renombra el archivo `admin2341.html` y actualiza este
README. **Esto es seguridad por oscuridad — apropiado solo para proyectos
académicos o demos, no para producción con datos reales de clientes.**

Al abrir esa URL, el panel inicia una sesión **anónima automática** de
Firebase. Esto permite que las reglas de Firestore exijan `request.auth != null`
para bloquear bots y acceso casual a la base de datos vía API.

---

## Configuración Firebase (paso a paso)

### 1. Crear proyecto en Firebase

1. Ve a https://console.firebase.google.com
2. Clic en **"Agregar proyecto"**
3. Ponle nombre: `eternal-beauty-studio`
4. Desactiva Google Analytics (no es necesario aún)

### 2. Activar Authentication (modo anónimo)

1. En el menú izquierdo → **Authentication** → **Comenzar**
2. Pestaña **Sign-in method** → Habilitar **Anonymous**
3. (Opcional) Deshabilita los demás métodos si no los necesitas

> No necesitas crear usuarios manualmente. El panel admin se loguea solo
> de forma anónima al cargar la página.

### 3. Activar Firestore

1. En el menú → **Firestore Database** → **Crear base de datos**
2. Selecciona **Modo de producción**
3. Escoge la región: `us-central1` (o la más cercana)

### 4. Reglas de seguridad Firestore

En Firestore → pestaña **Reglas**, pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservas/{docId} {
      // El público (no autenticado) puede CREAR reservas desde el formulario
      allow create: if true;
      // Solo sesiones autenticadas (incluye anónimas) pueden leer / editar / borrar
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### 5. Obtener configuración

1. En Firebase Console → ⚙️ Configuración del proyecto
2. Baja hasta **"Tus apps"** → clic en `</>` (Web)
3. Registra la app, copia el objeto `firebaseConfig`
4. Pégalo en `firebase-config.js` reemplazando los valores

---

## Colección Firestore: `reservas`

Cada documento tiene esta estructura:

| Campo    | Tipo      | Descripción                                     |
| -------- | --------- | ----------------------------------------------- |
| nombre   | string    | Nombre del cliente                              |
| telefono | string    | Teléfono / WhatsApp                             |
| servicio | string    | Nombre del servicio seleccionado                |
| fecha    | string    | Fecha preferida (YYYY-MM-DD)                    |
| hora     | string    | Hora preferida (HH:MM)                          |
| mensaje  | string    | Mensaje adicional (opcional)                    |
| estado   | string    | pendiente / confirmada / cancelada / completada |
| creadoEn | timestamp | Fecha de creación automática                    |

---

## Panel de administración

| Función           | Descripción                                     |
| ----------------- | ----------------------------------------------- |
| KPIs              | Total, pendientes, confirmadas, completadas     |
| Tabla de reservas | Listado con filtros por estado y búsqueda       |
| Confirmar reserva | Cambia estado a "confirmada"                    |
| Cancelar reserva  | Cambia estado a "cancelada"                     |
| Completar reserva | Cambia estado a "completada"                    |
| Contactar cliente | Abre WhatsApp directo al cliente con el mensaje |
| Cerrar sesión     | Cierra la sesión anónima y vuelve al sitio      |

---

## Flujo de reserva (cliente)

1. Cliente llena el formulario en el sitio
2. Se guarda en Firestore con estado `pendiente`
3. Se abre WhatsApp automáticamente con el resumen
4. Admin ve la reserva en el panel → la confirma
5. Admin puede contactar al cliente desde el panel

---

## Próximos pasos sugeridos

- [ ] Chatbot básico (Claude API o Tidio)
- [ ] Notificaciones por email al admin (Firebase Functions)
- [ ] Calendario de disponibilidad real
- [ ] Galería con Firebase Storage
- [ ] Múltiples salones (multitenancy)

---

## Deploy gratuito

**Firebase Hosting:**

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**O con Netlify:** arrastra la carpeta al dashboard de netlify.com
