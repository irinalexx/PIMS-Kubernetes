import { useEffect, useState } from "react";
import { realtimeDb } from "../../../config/firebase";
import { ref, onValue } from "firebase/database";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState({}); // Stores complaint details for feedbacks

  useEffect(() => {
    const feedbackRef = ref(realtimeDb, "feedbacks");

    // Fetch feedbacks to get complaint IDs
    onValue(feedbackRef, (snapshot) => {
      if (snapshot.exists()) {
        const feedbackList = [];
        const complaintIds = new Set(); // Store unique complaint IDs

        snapshot.forEach((childSnapshot) => {
          const feedbackData = { id: childSnapshot.key, ...childSnapshot.val() };
          feedbackList.push(feedbackData);
          if (feedbackData.complaintId) {
            complaintIds.add(feedbackData.complaintId);
          }
        });

        setFeedbacks(feedbackList);

        // Fetch complaints related to feedbacks
        fetchComplaintDetails(Array.from(complaintIds));
      } else {
        setFeedbacks([]);
      }
    });
  }, []);

  // Fetch complaint details based on complaint IDs found in feedbacks
  const fetchComplaintDetails = (complaintIds) => {
    const complaintData = {};
    
    complaintIds.forEach((id) => {
      const complaintRef = ref(realtimeDb, `complaints/${id}`);
      onValue(complaintRef, (snapshot) => {
        if (snapshot.exists()) {
          complaintData[id] = snapshot.val();
        } else {
          complaintData[id] = { category: "Not Specified", description: "No Description Available" };
        }
        setComplaints((prev) => ({ ...prev, ...complaintData })); // Merge new data
      });
    });
  };

  return (
    <div className="p-5">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
        Feedbacks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {feedbacks.length > 0 ? (
          feedbacks.map((fb) => {
            const complaint = complaints[fb.complaintId] || {};
            return (
              <div
                key={fb.id}
                className="bg-white shadow-lg rounded-xl p-4 border border-gray-300 hover:shadow-2xl transition-all"
              >
                <h2 className="text-lg font-semibold text-gray-600">Complaint ID: {fb.complaintId}</h2>
                <p className="text-gray-500"><strong>Category:</strong> {complaint.category || "Not Specified"}</p>
                <p className="text-gray-500"><strong>Description:</strong> {complaint.description || "No Description Available"}</p>
                <p className="mt-2 text-indigo-500"><strong>Feedback:</strong> {fb.feedback}</p>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center col-span-3">No feedback available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbacks;
