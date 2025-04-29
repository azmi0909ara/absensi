// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';


// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcrmu6ZAenAZnhGMqBSZ9-IwLr05TkeqY",
  authDomain: "absensi-a4040.firebaseapp.com",
  databaseURL: "https://absensi-a4040-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "absensi-a4040",
  storageBucket: "absensi-a4040.firebasestorage.app",
  messagingSenderId: "41800735578",
  appId: "1:41800735578:web:22e94b7706161d64cf7163",
  measurementId: "G-5XBDWHMHXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

// Getting Auth and Firestore Instances
const auth = getAuth(app);
const firestore = getFirestore(app); // Firestore instance is named "firestore"

export { firestore, auth }; // Export firestore and auth

