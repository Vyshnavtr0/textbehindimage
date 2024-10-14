// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-ag9BCwGhFEsuAQSeG7MVis98xUhYJBU",
  authDomain: "textinsideimage.firebaseapp.com",
  projectId: "textinsideimage",
  storageBucket: "textinsideimage.appspot.com",
  messagingSenderId: "558991178680",
  appId: "1:558991178680:web:959c2d6736ec94452d6d4d",
  measurementId: "G-8QBQY4PZ14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);