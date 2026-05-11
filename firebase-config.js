// ============================================================
// firebase-config.js  — Eternal Beauty Studio
// Reemplaza los valores con los de tu proyecto Firebase
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDISg9Le0YppqqanblwmybDSfW6VphA3Ak",
  authDomain: "salondebelle.firebaseapp.com",
  projectId: "salondebelle",
  storageBucket: "salondebelle.firebasestorage.app",
  messagingSenderId: "680509237149",
  appId: "1:680509237149:web:a4e7a542be939720753174",
  measurementId: "G-6F6BCE11J8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);