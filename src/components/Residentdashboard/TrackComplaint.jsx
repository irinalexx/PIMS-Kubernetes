import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useAuth } from "../../contexts/AuthContext"; // Ensure correct path
import { realtimeDb } from "../../config/firebase";

export default function TrackComplaint() {
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
          .filter((complaint) => complaint.userId === currentUser.uid); // ✅ Filter for the user

        setComplaints(userComplaints);
      } else {
        setComplaints([]);
      }
      setLoading(false);
    });

    return () => {}; // Cleanup function (optional)
  }, [currentUser]);

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800"; // Yellow for pending
      case "in progress":
        return "bg-blue-200 text-blue-800"; // Blue for in progress
      case "resolved":
        return "bg-green-200 text-green-800"; // Green for resolved
      case "rejected":
        return "bg-red-200 text-red-800"; // Red for rejected
      default:
        return "bg-gray-200 text-gray-800"; // Default gray
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Track Complaints</h1>

      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p className="text-gray-500">No registered complaints.</p>
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
              {/* Status Badge */}
              <span
                className={`inline-block mt-3 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  complaint.status || "pending"
                )}`}
              >
                {complaint.status || "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
