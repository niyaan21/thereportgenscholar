
// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"; // Added GoogleAuthProvider
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBYK_hGTQIhCGm6sxfFigbRcPBP4YEtwAI",
  authDomain: "scholarai-v4ygd.firebaseapp.com",
  projectId: "scholarai-v4ygd",
  storageBucket: "scholarai-v4ygd.firebasestorage.app",
  messagingSenderId: "839164332336",
  appId: "1:839164332336:web:53607fd6f130a875dd20f5"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // Create an instance of GoogleAuthProvider

export { app, auth, googleProvider }; // Export googleProvider
