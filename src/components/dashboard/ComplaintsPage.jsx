import React, { useState, useEffect,useRef } from "react";
import { ref, onValue, update } from "firebase/database";
import { realtimeDb } from "../../config/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { FaEye, FaCheckCircle, FaTimesCircle, FaEdit, FaUndo, FaTimes } from "react-icons/fa";
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from "@mui/material";


export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [assignDepartment, setAssignDepartment] = useState("");
  const [editingDepartment, setEditingDepartment] = useState(false);
  const departments = ["PWD", "Water", "Forest", "KSEB", "Municipality"];

  // Fetch complaints from Firebase
  useEffect(() => {
    const complaintsRef = ref(realtimeDb, "complaints");
    onValue(complaintsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const complaintsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setComplaints(complaintsArray);
      }
    });
  }, []);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);

  // Handle viewing complaint details
  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setEditingDepartment(false);
    setShowDialog(true); 
  };
  useEffect(() => {
    if (showMap && selectedComplaint.latitude && selectedComplaint.longitude) {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAd9H-eHez9E8oFtgoPdoVWwIKAuBKECHg`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    }
  }, [showMap,selectedComplaint]);
  
  const initializeMap = () => {
    if (!mapRef.current) return;
  
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: selectedComplaint.latitude, lng: selectedComplaint.longitude },
      zoom: 15,
    });
  
    new window.google.maps.Marker({
      position: { lat: selectedComplaint.latitude, lng: selectedComplaint.longitude },
      map: map,
    });
  };

  // Assign department to complaint
  const handleAssignDepartment = async () => {
    if (!assignDepartment || !selectedComplaint) return;
  
    const complaintRef = ref(realtimeDb, `complaints/${selectedComplaint.id}`);
    const deptComplaintRef = ref(realtimeDb, `departments/${assignDepartment}/complaints/${selectedComplaint.id}`);
  
    await update(complaintRef, {
      status: "verified",
      department: assignDepartment,
    });
  
    // Move complaint data to the assigned department's complaints node
    await update(deptComplaintRef, { ...selectedComplaint, status: "verified", department: assignDepartment });
  
    alert(`Complaint assigned to ${assignDepartment}`);
    setShowDialog(false);
    setAssignDepartment("");
  };
  

  // Handle rejection of complaint
  const handleReject = async () => {
    await update(ref(realtimeDb, `complaints/${selectedComplaint.id}`), {
      status: "rejected",
    });
    setShowDialog(false);
  };

  // Handle editing the assigned department
  const handleEditDepartment = async () => {
    if (!assignDepartment) return;
    await update(ref(realtimeDb, `complaints/${selectedComplaint.id}`), {
      department: assignDepartment,
    });
    alert(`Department updated to ${assignDepartment}`);
    setShowDialog(false);
    setAssignDepartment("");
  };

  // Undo rejection and move complaint back to pending
  const handleUndoReject = async (complaintId) => {
    await update(ref(realtimeDb, `complaints/${complaintId}`), {
      status: null,
      department: null,
    });
  };

  // Categorize complaints
  const pendingComplaints = complaints.filter((c) => !c.status);
  const verifiedComplaints = complaints.filter((c) => c.status === "verified");
  const rejectedComplaints = complaints.filter((c) => c.status === "rejected");

  
  return (
    <div className="p-6 space-y-6">
      {/* Pending Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50 border-b">
                  <td className="p-2">{complaint.category}</td>
                  <td className="p-2">
                    <Button
                      size="sm"
                      className="bg-[#FAD02E] text-white hover:bg-[#E6BD28]"
                      onClick={() => handleViewComplaint(complaint)}
                    >
                      <FaEye className="mr-2" /> View Complaint
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Verified Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>Verified Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Department</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifiedComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50 border-b">
                  <td className="p-2">{complaint.category}</td>
                  <td className="p-2">{complaint.department}</td>
                  <td className="p-2">
                    <Button
                      size="sm"
                     className="bg-[#A7C7E7] text-black hover:bg-[#90B6D6] ml-2"
                      onClick={() => handleViewComplaint(complaint)}
                    >
                      <FaEdit className="mr-2" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Rejected Complaints */}
<Card>
  <CardHeader>
    <CardTitle>Rejected Complaints</CardTitle>
  </CardHeader>
  <CardContent>
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b">
          <th className="p-2 text-left">Category</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rejectedComplaints.length > 0 ? (
          rejectedComplaints.map((complaint) => (
            <tr key={complaint.id} className="hover:bg-gray-50 border-b">
              <td className="p-2">{complaint.category}</td>
              <td className="p-2">
                <Button
                  size="sm"
                  className="bg-gray-500 text-white hover:bg-gray-600"
                  onClick={() => handleUndoReject(complaint.id)}
                >
                  <FaUndo className="mr-2" /> Undo
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="2" className="p-2 text-center text-gray-500">
              No rejected complaints
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </CardContent>
</Card>


      {/* Complaint Details Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>
          Complaint Details
          <FaTimes
            className="float-right cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => setShowDialog(false)}
          />
        </DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <div>
              <p><strong>Category:</strong> {selectedComplaint.category}</p>
              <p><strong>Description:</strong> {selectedComplaint.description}</p>
              <p><strong>Location:</strong> {selectedComplaint.address}
              <span 
                className="text-blue-600 cursor-pointer hover:underline ml-2"
                onClick={() => setShowMap(true)}
              >
                Show on Map
              </span></p>
              <p><strong>Date:</strong> {new Date(selectedComplaint.timestamp).toLocaleString()}</p>

              
              {/* Assign Department (For New Complaints) */}
{!selectedComplaint.status && (
  <>
    <p className="mt-4">Select Department:</p>
    <Select
      displayEmpty
      value={assignDepartment}
      onChange={(e) => setAssignDepartment(e.target.value)}
      className="w-full"
    >
      <MenuItem value="" disabled>
        Select Department
      </MenuItem>
      {departments.map((dept) => (
        <MenuItem key={dept} value={dept}>
          {dept}
        </MenuItem>
      ))}
    </Select>

    <Button 
      className="mt-2 bg-[#73C2BE] text-black hover:bg-[#5AA8A5] w-full"
      onClick={handleAssignDepartment}>
      <FaCheckCircle className="mr-2" /> Verify & Assign
    </Button>
  </>
)}


{selectedComplaint.status === "verified" && (
  <>
    <p className="mt-4"><strong>Current Department:</strong> {selectedComplaint.department}</p>
    <Select
      value={assignDepartment}
      onChange={(e) => setAssignDepartment(e.target.value)}
      className="w-full"
      displayEmpty
    >
      <MenuItem value="" disabled>Select Department</MenuItem>
      {departments.map((dept) => (
        <MenuItem key={dept} value={dept}>
          {dept}
        </MenuItem>
      ))}
    </Select>
    <Button
      className="mt-2 bg-[#FFD166] text-black hover:bg-[#E6B455] w-full"
      onClick={handleEditDepartment}
    >
      <FaCheckCircle className="mr-2" /> Change Department
    </Button>
  </>
)}


              {/* Reject Button */}
              <Button className="mt-2 bg-[#F28B82] text-black hover:bg-[#E57373] w-full"
               onClick={handleReject}>
                <FaTimesCircle className="mr-2" /> Reject
              </Button>
            </div>
          )}
        </DialogContent>
        {/* Google Map Modal */}
        {showMap && selectedComplaint.latitude && selectedComplaint.longitude && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-full max-w-2xl relative">
              <button 
                onClick={() => setShowMap(false)} 
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                X
              </button>

              <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
            </div>
          </div>
        )}

      </Dialog>
    </div>
  );
}