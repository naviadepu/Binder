// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA09JIvEwPqKrW5AK1N_VjhpzscypqOUBE",
  authDomain: "binder-app-89e2e.firebaseapp.com",
  projectId: "binder-app-89e2e",
  storageBucket: "binder-app-89e2e.firebasestorage.app",
  messagingSenderId: "1012117468035",
  appId: "1:1012117468035:web:13ea088d49dd61006d7cb6",
  measurementId: "G-CW6X02G176"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
const auth = getAuth(app);

export { auth };