// src/firebaseConfig.js
import {initializeApp} from 'firebase/app';
import {getDatabase} from 'firebase/database'; // For Realtime Database (if needed)
// If you plan to use authentication or Firestore, import those as well
// import { getAuth } from "firebase/auth"; // For authentication (if needed)
// import { getFirestore } from "firebase/firestore"; // For Firestore (if needed)

const firebaseConfig = {
  apiKey: 'AIzaSyDSZtkVQF43Ocq22Xiirykhq_5H0sgpx0Y',
  authDomain: 'kisanconnect-firebase-api.firebaseapp.com',
  projectId: 'kisanconnect-firebase-api',
  storageBucket: 'kisanconnect-firebase-api.appspot.com',
  messagingSenderId: '687362539476',
  appId: '1:687362539476:web:092bcb471ed98d3f36a041',
  measurementId: 'G-7YBNTPG0Y4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Realtime Database and export it
export const db = getDatabase(app);

// Uncomment and initialize these if you're using them
// export const auth = getAuth(app);
// export const firestore = getFirestore(app);
