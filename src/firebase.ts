import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBcrvpytyWAoBMUI1_6SwuHx5ew_vBAA_A",
  authDomain: "grand-luxury-b49dc.firebaseapp.com",
  projectId: "grand-luxury-b49dc",
  storageBucket: "grand-luxury-b49dc.firebasestorage.app",
  messagingSenderId: "185872592144",
  appId: "1:185872592144:web:56826e89ea1265fd450995"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})
