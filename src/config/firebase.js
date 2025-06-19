import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA5YXj1iWE2WqRlYxw_qw9cgKjcw3AAZY0",
  authDomain: "pims-react.firebaseapp.com",
  databaseURL: "https://pims-react-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pims-react",
  storageBucket: "pims-react.firebasestorage.app",
  messagingSenderId: "459013562324",
  appId: "1:459013562324:web:0581531c192881c8c70041",
  measurementId: "G-CRRBB3PZB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const realtimeDb  = getDatabase(app);
export const messaging = getMessaging(app);
export const googleProvider =new GoogleAuthProvider();

export default app; 