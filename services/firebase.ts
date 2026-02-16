
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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

// Export Auth only (Real Firebase Auth)
export const auth = getAuth(app);

// Keep DB as mock object to avoid Firestore errors
export const db = {} as any;
