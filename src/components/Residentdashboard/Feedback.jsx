import { useEffect, useState } from "react";
import { realtimeDb, auth } from "../../config/firebase";
import { ref, query, orderByChild, equalTo, get, update, push,set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa";

const Feedback = () => {
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Get logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch resolved complaints from Realtime Database
  useEffect(() => {
    if (!currentUser) return;

    const fetchResolvedComplaints = async () => {
      try {
        setLoading(true);

        const complaintsRef = ref(realtimeDb, "complaints");
        const complaintsQuery = query(complaintsRef, orderByChild("userId"), equalTo(currentUser.uid));

        const snapshot = await get(complaintsQuery);

        if (snapshot.exists()) {
          const complaintsList = [];
          snapshot.forEach((childSnapshot) => {
            const complaint = { id: childSnapshot.key, ...childSnapshot.val() };
            if (complaint.status === "Resolved" || complaint.status === "resolved") {
              complaintsList.push(complaint);
            }
          });

          console.log("Fetched complaints:", complaintsList); // Debugging

          setComplaints(complaintsList);
        } else {
          setComplaints([]);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedComplaints();
  }, [currentUser]);

  const handleFeedbackChange = (complaintId, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [complaintId]: value,
    }));
  };

  const submitFeedback = async (complaintId) => {
    if (!feedbacks[complaintId]) return;

    try {
      const feedbackText = feedbacks[complaintId];

      // 1️⃣ Store feedback **inside the complaint**
      const complaintRef = ref(realtimeDb, `complaints/${complaintId}`);
      await update(complaintRef, { feedback: feedbackText });

      // 2️⃣ Store feedback **in a separate "feedbacks" collection** for Admin Dashboard
      const feedbackRef = push(ref(realtimeDb, "feedbacks"));
      await set(feedbackRef, {
        complaintId,
        userId: currentUser.uid,
        feedback: feedbackText,
        timestamp: new Date().toISOString(),
      });

      alert("Feedback submitted successfully!");
      setFeedbacks((prev) => ({ ...prev, [complaintId]: "" }));
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Your Resolved Complaints <FaCheckCircle className="inline-block text-green-500 ml-2" />
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : complaints.length === 0 ? (
          <p className="text-center text-gray-500">No resolved complaints yet.</p>
        ) : (
          complaints.map((complaint) => (
            <motion.div
              key={complaint.id}
              whileHover={{ scale: 1.02 }}
              className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-700">{complaint.category}</h3>
              <p className="text-gray-600 text-sm">{complaint.description}</p>
              <p className="text-sm text-green-600 font-medium mt-2">Status: {complaint.status}</p>

              {/* Feedback Section */}
              <div className="mt-4">
              <textarea
                  value={feedbacks[complaint.id] || ""}
                  onChange={(e) => handleFeedbackChange(complaint.id, e.target.value)}
                  placeholder="Write your feedback..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
                <button
                  onClick={() => submitFeedback(complaint.id)}
                  className="mt-2 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                >
                  <FaPaperPlane className="mr-2" /> Submit Feedback
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Feedback;
