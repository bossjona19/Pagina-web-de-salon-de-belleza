// ============================================================
// firebase-config.js  — Eternal Beauty Studio
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDISg9Le0YppqqanblwmybDSfW6VphA3Ak",
  authDomain:        "salondebelle.firebaseapp.com",
  projectId:         "salondebelle",
  storageBucket:     "salondebelle.firebasestorage.app",
  messagingSenderId: "680509237149",
  appId:             "1:680509237149:web:a4e7a542be939720753174",
  measurementId:     "G-6F6BCE11J8"
};

const app = initializeApp(firebaseConfig);

// ⬇️  Estas dos exportaciones son las que usan app.js y admin.js
export const auth = getAuth(app);
export const db   = getFirestore(app);