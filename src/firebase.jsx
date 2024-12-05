// src/firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,   
    appId: import.meta.env.VITE_FIREBASE_APP_ID,

    // apiKey: "AIzaSyDtAY1xUzwpxGE2I4kNnmqoc7j6qhFOUr0",
    // authDomain: "auth-mern-app-432118.firebaseapp.com",
    // projectId: "auth-mern-app-432118",
    // storageBucket: "auth-mern-app-432118.firebasestorage.app",
    // messagingSenderId: "795899223130",
    // appId: "1:795899223130:web:a0b0be7737aeba2a11cc63"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };