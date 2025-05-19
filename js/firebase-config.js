// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  // Replace with your Firebase config object
  apiKey: "AIzaSyDOL8EAF_5kYHAom1fZ_7UiAxWcWIJ5Aok",
  authDomain: "pack-go-5d568.firebaseapp.com",
  projectId: "pack-go-5d568",
  storageBucket: "pack-go-5d568.firebasestorage.app",
  messagingSenderId: "525870091383",
  appId: "1:525870091383:web:06655ed6e02bcf40e28a72",
  measurementId: "G-R9DE3EBPD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app); 