import React, { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { realtimeDb } from "../../../config/firebase";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

export default function AdminReports() {
  const [invalidComplaints, setInvalidComplaints] = useState([]);

  useEffect(() => {
    const complaintsRef = ref(realtimeDb, "complaints");

    onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const filteredComplaints = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] })) // Convert object to array
          .filter((complaint) => complaint.status === "Invalid"); // Get only invalid complaints

        setInvalidComplaints(filteredComplaints);
      }
    });
  }, []);

  const handleRejectComplaint = (complaintId) => {
    const complaintRef = ref(realtimeDb, `complaints/${complaintId}`);
    
    update(complaintRef, { status: "Rejected" })
      .then(() => {
        setInvalidComplaints((prev) => prev.filter((c) => c.id !== complaintId));
      })
      .catch((error) => {
        console.error("Error rejecting complaint:", error);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Invalid Complaints Reports</h2>

      {invalidComplaints.length === 0 ? (
        <p className="text-gray-500">No invalid complaints found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invalidComplaints.map((complaint) => (
            <Card key={complaint.id} className="bg-white shadow-md p-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Complaint ID: {complaint.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Category:</strong> {complaint.category}</p>
                <p><strong>Location:</strong> {complaint.location}</p>
                <p><strong>Description:</strong> {complaint.description}</p>
                <p className="text-red-600"><strong>Reason for Invalidity:</strong> {complaint.invalidReason}</p>
                <div className="mt-4">
                  <Button 
                    variant="destructive"
                    onClick={() => handleRejectComplaint(complaint.id)}
                  >
                    Reject Complaint
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
