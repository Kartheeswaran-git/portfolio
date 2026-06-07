import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//config
const firebaseConfig = {
  
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
