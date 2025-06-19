import React from "react";
import { auth, googleProvider, db } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userRef = doc(db, "residents", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Store user details in Firestore
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
    }

    console.log("User signed in:", user);
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export default function GoogleAuthButton() {
  return (
    <button 
      onClick={signInWithGoogle} 
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Sign in with Google
    </button>
  );
}

export { signInWithGoogle }; // ✅ Export function only once
