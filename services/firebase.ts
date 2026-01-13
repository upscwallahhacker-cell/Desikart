import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkBkNBEClaOgHvV3qVfnEBkOIp0PaJsjo",
  authDomain: "deshikaart.firebaseapp.com",
  projectId: "deshikaart",
  storageBucket: "deshikaart.firebasestorage.app",
  messagingSenderId: "748650706625",
  appId: "1:748650706625:web:070fada0d3e8bfa3520640"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;