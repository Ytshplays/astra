// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "nexus-hub-v2gfz",
  "appId": "1:665913754987:web:003fc77d2993f7f88d382e",
  "storageBucket": "nexus-hub-v2gfz.firebasestorage.app",
  "apiKey": "AIzaSyCI7IdVOA64VzlQYy6fIrq30qFWy9UZ6P8",
  "authDomain": "nexus-hub-v2gfz.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "665913754987"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
