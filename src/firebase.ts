import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBcrvpytyWAoBMUI1_6SwuHx5ew_vBAA_A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "grand-luxury-b49dc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "grand-luxury-b49dc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "grand-luxury-b49dc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "185872592144",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:185872592144:web:56826e89ea1265fd450995"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})
