import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//config
const firebaseConfig = {
  apiKey: "AIzaSyCFZSNjMj8j82UiPN2UfmYX0BxgHpnDeUo",
  authDomain: "portfoilo-2feb4.firebaseapp.com",
  projectId: "portfoilo-2feb4",
  storageBucket: "portfoilo-2feb4.firebasestorage.app",
  messagingSenderId: "910092048979",
  appId: "1:910092048979:web:96a3f5d3373b44dce5c4a6",
  measurementId: "G-WTQNW2B0JP",
};

const app = initializeApp(firebaseConfig);

export const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analyticsPromise = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);
export default app;
