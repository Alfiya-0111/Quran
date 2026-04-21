// 🔹 Firebase core
import { initializeApp } from "firebase/app";

// 🔹 Analytics (optional)
import { getAnalytics } from "firebase/analytics";

// 🔹 Firestore
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";

// 🔹 Auth
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from "firebase/auth";

// 🔹 Config
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "quran-3fa16.firebaseapp.com",
  projectId: "quran-3fa16",
  storageBucket: "quran-3fa16.firebasestorage.app",
  messagingSenderId: "716775968613",
  appId: "1:716775968613:web:d5b7d8215ca5d66e819b8c",
  measurementId: "G-6JCS09GR92"
};

// 🔹 Initialize
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ ADD THIS (missing tha)
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Anonymous login function
const loginAnonymous = () => signInAnonymously(auth);

// 🔹 Export everything
export { 
  db, 
  auth, 
  loginAnonymous, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
};