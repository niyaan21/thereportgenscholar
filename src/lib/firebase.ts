// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYK_hGTQIhCGm6sxfFigbRcPBP4YEtwAI",
  authDomain: "scholarai-v4ygd.firebaseapp.com",
  databaseURL: "https://scholarai-v4ygd-default-rtdb.firebaseio.com",
  projectId: "scholarai-v4ygd",
  storageBucket: "scholarai-v4ygd.appspot.com",
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
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
