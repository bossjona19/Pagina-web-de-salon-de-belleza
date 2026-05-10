# Eternal Beauty Studio — MVP

Sitio web + panel de administración para salones de belleza.
Stack: HTML · CSS · JavaScript Vanilla · Firebase (Auth + Firestore)

---

## Estructura de archivos

```
/
├── index.html          → Sitio principal (clientes)
├── login.html          → Login para administrador
├── admin.html          → Panel de gestión de reservas
├── si.css              → Estilos principales
├── firebase-config.js  → ⚠️ Configuración Firebase (editar)
├── app.js              → Lógica del sitio principal
└── img/                → Fotos para el before/after
    ├── 1.jpeg
    ├── 2.jpeg
    ├── 3.jpeg
    └── 4.jpeg
```

---

## Configuración Firebase (paso a paso)

### 1. Crear proyecto en Firebase

1. Ve a https://console.firebase.google.com
2. Clic en **"Agregar proyecto"**
3. Ponle nombre: `eternal-beauty-studio`
4. Desactiva Google Analytics (no es necesario aún)

### 2. Activar Authentication

1. En el menú izquierdo → **Authentication** → **Comenzar**
2. Pestaña **Sign-in method** → Habilitar **Correo/Contraseña**
3. Ve a **Users** → **Agregar usuario**
4. Escribe el email y contraseña del admin del salón

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
    // Solo usuarios autenticados pueden leer/escribir reservas
    match /reservas/{docId} {
      allow read, write: if request.auth != null;
      allow create: if true;  // público puede crear reservas
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
| Cerrar sesión     | Logout de Firebase Auth                         |

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
