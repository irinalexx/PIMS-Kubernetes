import React, { useState, useEffect } from "react";
import { realtimeDb } from "../../../config/firebase"
import { ref, get } from "firebase/database"; // Import Realtime DB functions
import { Button } from "../../ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

const TrackComplaints = () => {
  const [departments, setDepartments] = useState([
    "PWD",
    "Water",
    "KSEB",
    "Forest",
    "Municipality",
  ]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsRef = ref(realtimeDb, "complaints");
        const snapshot = await get(complaintsRef);
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          const complaintsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
  
          console.log("Fetched Complaints:", complaintsArray); // ✅ Debugging log
          setComplaints(complaintsArray);
        } else {
          console.warn("No complaints found in Realtime Database.");
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
  
    fetchComplaints();
  }, []);
  
  
    // Filter complaints based on the selected department
  const filteredComplaints = selectedDept
  ? complaints.filter((complaint) => complaint.department?.toLowerCase() === selectedDept.toLowerCase())
  : [];

  return (
    <div className="p-6">
      {/* Department Selection */}
      <h2 className="text-2xl text-orange-400 font-bold mb-4">Select Department to Track its Complaints</h2>
      <div className="h-8"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {departments.map((dept) => (
          <Button
            key={dept}
            variant={selectedDept === dept ? "default" : "outline"}
            className={`text-lg font-semibold py-3 px-6 rounded-lg transition-all duration-300 
                 shadow-md hover:shadow-lg hover:scale-105
                ${selectedDept === dept ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setSelectedDept(dept)}
          >
            {dept}
          </Button>
        ))}
      </div>

      {/* Complaints List */}
      {selectedDept && (
        <div>
          <h3 className="text-xl font-semibold mb-4">{selectedDept} Complaints</h3>
          {filteredComplaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="shadow-md hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg">{complaint.category || "Complaint"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{complaint.description || "No description provided."}</p>
                  <p className="text-gray-500 text-sm"><strong>Location:</strong> {complaint.location || "Unknown"}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      complaint.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-600"
                        : complaint.status === "Resolved"
                        ? "bg-green-100 text-green-600"
                        : complaint.status === "Rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {complaint.status || "Pending"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No complaints found for this department.</p>
        )}

        </div>
      )}
    </div>
  );
}
export default TrackComplaints;
