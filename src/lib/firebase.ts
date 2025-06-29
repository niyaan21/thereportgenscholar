// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

// Firebase configuration is now loaded from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;

// Check that all environment variables are set before initializing
if (Object.values(firebaseConfig).every(Boolean)) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} else {
    console.error("Firebase configuration is missing. Make sure all NEXT_PUBLIC_FIREBASE_* environment variables are set in your .env file.");
    // Create a dummy app to avoid crashing the server during build if keys are missing
    if (!getApps().length) {
        app = initializeApp({ apiKey: "dummy-key-for-build" });
    } else {
        app = getApp();
    }
}


const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
