import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db} from "../../config/firebase";// Adjust path if needed
import { doc, getDoc , updateDoc} from "firebase/firestore";
import ResidentDashboard from "../dashboard/ResidentDashboard";


const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", phone: "", address: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
          setLoading(true);
          auth.onAuthStateChanged(async (user) => {
            if (user) {
              try {
                const userRef = doc(db, "residents", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  setUserData(userSnap.data());
                  setFormData({
                    fullName: userSnap.data().fullName,
                    phone: userSnap.data().phone,
                    address: userSnap.data().address
                  });
                } else {
                  console.error("User data not found in Firestore.");
                }
              } catch (error) {
                console.error("Error fetching user data:", error);
              }
            }
            setLoading(false);
          });
        };
    
        fetchUserData();
      }, []);
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSave = async () => {
        if (userData) {
          try {
            const userRef = doc(db, "residents", auth.currentUser.uid);
            await updateDoc(userRef, {
              fullName: formData.fullName,
              phone: formData.phone,
              address: formData.address
            });
            setUserData({ ...userData, ...formData });
            setEditMode(false);
          } catch (error) {
            console.error("Error updating user data:", error);
          }
        }
      };
    
      return (
        <div className="bg-gray-100 max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-green-800 mb-4">User Profile</h1>
    
          {loading ? (
            <p className="text-gray-700">Loading user details...</p>
          ) : (
            <div className="bg-white-100 p-4 rounded-lg">
              <label className="block font-semibold">Name:</label>
              {editMode ? (
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  className="w-full border p-2 rounded-lg mb-2" />
              ) : (
                <p>{userData.fullName}</p>
              )}
    
              <label className="block font-semibold">Email:</label>
              <p>{userData.email} (Cannot be changed)</p>
    
              <label className="block font-semibold">Phone:</label>
              {editMode ? (
                <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full border p-2 rounded-lg mb-2" />
              ) : (
                <p>{userData.phone}</p>
              )}
    
              <label className="block font-semibold">Address:</label>
              {editMode ? (
                <input type="text" name="address" value={formData.address} onChange={handleChange}
                  className="w-full border p-2 rounded-lg mb-2" />
              ) : (
                <p>{userData.address}</p>
              )}
    
              {editMode ? (
                <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
                  onClick={handleSave}>
                  Save Changes
                </button>
              ) : (
                <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          )}
    
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
            onClick={() => navigate("/resident-dashboard")}>
            Back to Dashboard
          </button>
        </div>
      );
    };
    
    export default UserProfile;