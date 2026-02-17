
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqIi0loPJbjs7s7DHyPJaq7oHLAei-K_c",
  authDomain: "sharfin-s-store.firebaseapp.com",
  projectId: "sharfin-s-store",
  storageBucket: "sharfin-s-store.firebasestorage.app",
  messagingSenderId: "929794727403",
  appId: "1:929794727403:web:611b1854976009b9634dae",
  measurementId: "G-405C0PF213"
};

const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);

// Export Firestore Database
export const db = getFirestore(app);