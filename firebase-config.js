// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASgs_3uoRTM6SbwxLc3TEft7bu06k4k0U",
  authDomain: "livebongda-f6225.firebaseapp.com",
  projectId: "livebongda-f6225",
  storageBucket: "livebongda-f6225.firebasestorage.app",
  messagingSenderId: "1043643359548",
  appId: "1:1043643359548:web:259ef54008d2c15f683e39",
  measurementId: "G-069DD26K06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);