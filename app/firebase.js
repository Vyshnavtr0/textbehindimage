// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOTdrz_W0sCN7dlMsa-1zf1zmz6zwLsQw",
  authDomain: "textualizeimage.firebaseapp.com",
  projectId: "textualizeimage",
  storageBucket: "textualizeimage.appspot.com",
  messagingSenderId: "561481265139",
  appId: "1:561481265139:web:d5e18f7070e6d73acfec86",
  measurementId: "G-GSNCJ0T96Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
