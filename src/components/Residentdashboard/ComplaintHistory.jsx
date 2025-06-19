import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext"; // Ensure correct path
import { realtimeDb } from "../../config/firebase";

export default function ComplaintHistory() {
  const { currentUser } = useAuth(); // Get logged-in user
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const complaintsRef = ref(realtimeDb, "complaints");

    onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userComplaints = Object.entries(data)
          .map(([id, complaint]) => ({ id, ...complaint }))
          .filter((complaint) => complaint.userId === currentUser.uid); // ✅ Updated to userId

        console.log("Filtered complaints for user:", userComplaints); // Debugging

        setComplaints(userComplaints);
      } else {
        setComplaints([]);
      }
      setLoading(false);
    });

    return () => {}; // Cleanup function (optional)
  }, [currentUser]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Complaint History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p className="text-gray-500">No complaints found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                {complaint.category}
              </h2>
              <p className="text-gray-600">{complaint.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                📍 {complaint.address}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                🕒 {new Date(complaint.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
