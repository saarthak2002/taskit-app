import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "taskit-app-c9cf7.firebaseapp.com",
    projectId: "taskit-app-c9cf7",
    storageBucket: "taskit-app-c9cf7.appspot.com",
    messagingSenderId: "570100756160",
    appId: "1:570100756160:web:00f35f9aedb6dade448725",
    measurementId: "G-XTGBTDV4J0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);