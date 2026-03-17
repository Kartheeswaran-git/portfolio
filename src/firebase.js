import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCFZSNjMj8j82UiPN2UfmYX0BxgHpnDeUo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "portfoilo-2feb4.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "portfoilo-2feb4",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "portfoilo-2feb4.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "910092048979",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:910092048979:web:96a3f5d3373b44dce5c4a6",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-WTQNW2B0JP",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
