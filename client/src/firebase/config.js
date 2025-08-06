import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔥 Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCeTeYhfVw-P4DNE6YVNf_eWJ8H16c40Ck",
  authDomain: "echosphere-42610.firebaseapp.com",
  projectId: "echosphere-42610",
  storageBucket: "echosphere-42610.appspot.com", // ✅ corrected
  messagingSenderId: "892830474730",
  appId: "1:892830474730:web:44144ea5c28626c05fd293",
  measurementId: "G-MZ6RFJVX3T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 🔥 Initialize Firestore

export { auth, db }; // ✅ Export db
