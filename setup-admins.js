// ─────────────────────────────────────────────────────────────
// setup-admins.js  — Crea los usuarios admin en Firebase Auth
// Uso:  node setup-admins.js
// Borra este archivo después de ejecutarlo.
// ─────────────────────────────────────────────────────────────

const API_KEY = "AIzaSyDISg9Le0YppqqanblwmybDSfW6VphA3Ak";

// ⬇️  AGREGA / EDITA LOS ADMINS AQUÍ
const ADMINS = [
  { email: "quinterojonathan108@gmail.com", password: "EternalBeauty2025!" },
  // { email: "duena@correo.com",             password: "EternalBeauty2025!" },
  // { email: "asistente@correo.com",         password: "EternalBeauty2025!" },
];

async function createUser(email, password) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: false })
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

(async () => {
  console.log("Creando usuarios admin en Firebase Auth...\n");
  for (const admin of ADMINS) {
    try {
      await createUser(admin.email, admin.password);
      console.log(`✅  Creado: ${admin.email}`);
    } catch (err) {
      if (err.message === "EMAIL_EXISTS") {
        console.log(`⚠️   Ya existe: ${admin.email} (puedes ignorar esto)`);
      } else {
        console.error(`❌  Error con ${admin.email}: ${err.message}`);
      }
    }
  }
  console.log("\nListo. Borra este archivo (setup-admins.js) por seguridad.");
})();
