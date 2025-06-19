import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc,collection,query,where,getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Sign Up function for residents
  async function signup(email, password, fullName, phone, address) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send email verification
      await sendEmailVerification(user);
  
      // Update user profile with full name
      await updateProfile(user, {
        displayName: fullName
      });
  
      // Create user document in Firestore
      await setDoc(doc(db, 'residents', user.uid), {
        fullName,
        email,
        phone,
        address,
        role: 'resident',
        createdAt: new Date().toISOString()
      });
  
      setUserRole('resident');
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Login function for residents
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if user is a resident
      const residentDoc = await getDoc(doc(db, 'residents', user.uid));
      if (residentDoc.exists()) {
        setUserRole('resident');
        return { user, role: 'resident' };
      }
      
      // If not a resident, sign out
      await signOut(auth);
      throw new Error('Account not found as resident');
    } catch (error) {
      throw error;
    }
  }

  // ✅ Updated Admin Login function
async function adminLogin(email, password) {
  try {
    // ❌ Reject anyone who is not "pimsadmin@gmail.com"
    if (email !== "pimsadmin@gmail.com") {
      throw new Error("Unauthorized access. Admin login only.");
    }

    // ✅ Authenticate using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Fetch admin details from Firestore (check if the email exists in residents collection)
    const adminQuery = doc(db, "residents", user.uid); // Reference to Firestore document
    const adminDoc = await getDoc(adminQuery);

    if (!adminDoc.exists()) {
      await signOut(auth); // Logout user if they are not an admin
      throw new Error("Admin account not found in Firestore.");
    }

    // ✅ Set admin role in state
    setUserRole("admin");

    return { user, role: "admin" };
  } catch (error) {
    throw error;
  }
}

  

  // Department login function
async function departmentLogin(email, password, selectedDepartment) {
  try {
    // 🔹 Map departments to their respective email IDs
    const departmentEmails = {
      "KSEB": "kseb@gmail.com",
      "Water Authority": "water@gmail.com",
      "Public Works": "pwd@gmail.com",
      "Forest": "forest@gmail.com",
      "Muncipality": "municipality@gmail.com",
    };

    // 🔹 Check if the entered email matches the selected department
    if (email !== departmentEmails[selectedDepartment]) {
      throw new Error(`Unauthorized access. Please select the correct department.`);
    }

    // 🔹 Authenticate user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔹 Verify that the user exists in Firestore (in residents collection)
    const deptDocRef = doc(db, "residents", user.uid);
    const deptDoc = await getDoc(deptDocRef);

    if (!deptDoc.exists()) {
      await signOut(auth);
      throw new Error("Department account not found in Firestore.");
    }

    // 🔹 Set user role
    setUserRole("department");

    return { user, role: "department" };
  } catch (error) {
    throw error;
  }
}


  // Logout function
  async function logout() {
    try {
      await signOut(auth);
      setUserRole(null);
    } catch (error) {
      throw error;
    }
  }

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    adminLogin,
    departmentLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 