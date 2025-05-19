// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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
const analytics = getAnalytics(app);