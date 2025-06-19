import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { realtimeDb } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

import {
  FaTools,
  FaBuilding,
  FaRegEdit,
  FaExclamationCircle,
  FaSearch,
  FaPhoneAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiBell, BiUser } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import ContactAdmin from "./ContactAdmin";

export default function MuncipalityDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("overview");

  // Sample complaints data
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusDropdownId, setStatusDropdownId] = useState(null);


const handleViewComplaint = (complaint) => {
  setSelectedComplaint(complaint);
  setActivePage("viewComplaintDetails");
};

const [complaintCounts, setComplaintCounts] = useState({
  total: 0,
  verified: 0,
  inProgress: 0,
  resolved: 0,
});

const handleCloseComplaint = () => {
  setSelectedComplaint(null);
};

const [invalidComplaints, setInvalidComplaints] = useState([]); // Stores complaints reported as invalid
const [showReportInvalidPage, setShowReportInvalidPage] = useState(false); // Controls report invalid page visibility
const [selectedInvalidComplaint, setSelectedInvalidComplaint] = useState(null); // Stores complaint to be reported
const [invalidReason, setInvalidReason] = useState(""); // Stores invalid complaint reason


const handleUpdateStatus = (complaintId, newStatus) => {
  const complaintRef = ref(realtimeDb, `complaints/${complaintId}`);

  update(complaintRef, { status: newStatus })
    .then(() => {
      // Update the local state immediately to reflect the change
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint
        )
      );
      console.log(`Complaint ${complaintId} status updated to ${newStatus}`);
    })
    .catch((error) => {
      console.error("Error updating complaint status:", error);
    });
};


const handleReportInvalid = () => {
  if (!selectedInvalidComplaint || !invalidReason.trim()) {
    alert("Please enter a reason for reporting the complaint as invalid.");
    return;
  }

  const complaintRef = ref(realtimeDb, `complaints/${selectedInvalidComplaint.id}`);
  
  update(complaintRef, { status: "Invalid", invalidReason })
    .then(() => {
      // Update local state
      setInvalidComplaints((prev) => [
        ...prev,
        { ...selectedInvalidComplaint, status: "Invalid", invalidReason },
      ]);

      // Reset form
      setSelectedInvalidComplaint(null);
      setInvalidReason("");
    })
    .catch((error) => {
      console.error("Error reporting invalid complaint:", error);
    });
};


  useEffect(() => {
    const complaintsRef = ref(realtimeDb, "complaints");
  
    onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const filteredComplaints = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] })) // Convert object to array
          .filter((complaint) => complaint.department === "Muncipality"); // Filter PWD complaints
  
          // Calculate counts based on status
        const total = filteredComplaints.length;
        const verified = filteredComplaints.filter((c) => c.status === "Verified").length;
        const inProgress = filteredComplaints.filter((c) => c.status === "In Progress").length;
        const resolved = filteredComplaints.filter((c) => c.status === "Resolved").length;

        setComplaints(filteredComplaints);
        setComplaintCounts({ total, verified, inProgress, resolved }); // ✅ Update state

      }
    });
  }, []);
  
  const sidebarItems = [
    {
      section: "MAIN",
      items: [
        { icon: FaTools, label: "Dashboard", page: "overview", color: "text-blue-500" },
        { icon: FaBuilding, label: "View Complaints", page: "viewComplaints", color: "text-purple-500" },
      ],
    },
    {
      section: "COMPLAINTS",
      items: [
        { icon: FaRegEdit, label: "Update Status", page: "viewComplaints", color: "text-green-500" },
        { icon: FaExclamationCircle, label: "Report Invalid", page: "reportInvalid", color: "text-orange-500" },
      ],
    },
    {
      section: "SUPPORT",
      items: [
        { icon: FaPhoneAlt, label: "Contact Admin", page: "contactAdmin", color: "text-indigo-500" },
      ],
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const getComplaintStats = () => {
    const total = complaints.length;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    const verified = complaints.filter((c) => c.status === "verified").length;
    const inProgress = complaints.filter((c) => c.status === "In Progress").length;
    return { total, resolved, verified, inProgress  };
  };

  return (
    <div className="flex">
      {/* Sidebar (Fixed) */}
      <div className="fixed w-64 h-screen bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-blue-600">Municipality</h1>
        </div>
        <nav className="py-4">
          {sidebarItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="px-4 mb-2 text-sm font-semibold text-gray-500 text-left">
                {section.section}
              </h3>
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center px-4 py-2 text-base ${
                    activePage === item.page ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActivePage(item.page)}
                >
                  <item.icon className={`mr-3 w-5 h-5 ${item.color}`} />
                  <span className="text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
          <button
            className="w-full flex items-center px-4 py-2 text-base hover:bg-gray-100"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3 w-5 h-5 text-red-500" />
            <span className="text-gray-700">Logout</span>
          </button>
        </nav>
      </div>
  
      {/* Main Content */}
      <div className="ml-64 flex-1 h-screen overflow-auto bg-gray-50">
        {/* Top Navigation */}
        <div className="bg-white p-4 flex justify-end items-center space-x-4 shadow-md">
          <button className="p-1 text-gray-500 hover:text-gray-700">
            <BiBell className="w-6 h-6" />
          </button>
          <button className="p-1 text-gray-500 hover:text-gray-700" onClick={handleLogout}>
            <BiUser className="w-6 h-6" />
          </button>
        </div>
  
        {/* Dashboard Content */}
        <div className="p-6">
          {activePage === "overview" && (
            <div>
              {/* Complaint Statistics */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-semibold mb-4">Complaint Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-medium">Total Complaints</h3>
                    <p className="text-3xl font-bold">{complaintCounts.total}</p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg">
                    <h3 className="text-lg font-medium">Verified</h3>
                    <p className="text-3xl font-bold">{complaintCounts.verified}</p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg">
                    <h3 className="text-lg font-medium">In Progress</h3>
                    <p className="text-3xl font-bold">{complaintCounts.inProgress}</p>
                  </div>
                  <div className="p-4 bg-orange-100 rounded-lg">
                    <h3 className="text-lg font-medium">Resolved</h3>
                    <p className="text-3xl font-bold">{complaintCounts.resolved}</p>
                  </div>
                </div>
              </div>

              {/* Bar Chart for Complaints */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Complaints Status Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: "Total", value: complaintCounts.total },
                      { name: "Verified", value: complaintCounts.verified },
                      { name: "In Progress", value: complaintCounts.inProgress },
                      { name: "Resolved", value: complaintCounts.resolved },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4a90e2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}


          {activePage === "viewComplaints" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">View Complaints</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Complaint ID</th>
                    <th className="p-2 text-left">Date Received</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <React.Fragment key={complaint.id}>
                      {/* Complaint Row */}
                      <tr className="hover:bg-gray-50 border-b">
                        <td className="p-2">{complaint.id}</td>
                        <td className="p-2">{complaint.date}</td>
                        <td className="p-2">{complaint.status}</td>
                        <td className="p-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleViewComplaint(complaint)}
                          >
                            View Details
                          </button>
  
                          {/* Status Dropdown (conditionally rendered) */}
                          {statusDropdownId === complaint.id ? (
                            <select
                              className="ml-4 border border-gray-300 rounded px-2 py-1"
                              value={complaint.status}
                              onChange={(e) => handleUpdateStatus(complaint.id, e.target.value)}
                              onBlur={() => setStatusDropdownId(null)} // Hide dropdown on blur
                              autoFocus
                            >
                              <option value="Verified">Verified</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          ) : (
                            <button
                              className="ml-4 text-yellow-500 hover:text-yellow-700"
                              onClick={() => setStatusDropdownId(complaint.id)}
                            >
                              Update Status
                            </button>
                          )}
                        </td>
                      </tr>
  
                      {/* Complaint Details Row (Visible only if this complaint is selected) */}
                      {selectedComplaint && selectedComplaint.id === complaint.id && (
                        <tr>
                          <td colSpan="4" className="bg-gray-100 p-4 border border-gray-300">
                            <div className="rounded-lg p-4">
                              <h2 className="text-lg font-bold">Complaint Details</h2>
                              <p>
                                <strong>Complaint ID:</strong> {selectedComplaint.id}
                              </p>
                              <p>
                                <strong>Date Received:</strong> {selectedComplaint.date}
                              </p>
                              <p>
                                <strong>Status:</strong> {selectedComplaint.status}
                              </p>
                              <p>
                                <strong>Category:</strong> {selectedComplaint.category}
                              </p>
                              <p>
                                <strong>Location:</strong> {selectedComplaint.location}
                              </p>
                              <p>
                                <strong>Description:</strong> {selectedComplaint.description}
                              </p>
  
                              <div className="mt-4">
                                <button
                                  onClick={handleCloseComplaint}
                                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activePage === "reportInvalid" && (
                      <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Report Invalid Complaints</h2>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="p-2 text-left">Complaint ID</th>
                              <th className="p-2 text-left">Category</th>
                              <th className="p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {complaints.map((complaint) => (
                              <tr key={complaint.id} className="hover:bg-gray-50 border-b">
                                <td className="p-2">{complaint.id}</td>
                                <td className="p-2">{complaint.category}</td>
                                <td className="p-2">
                                  <button
                                   className="text-blue-500 hover:text-blue-700"
                                   onClick={() => handleViewComplaint(complaint)}
                                  >
                                    View Details
                                  </button>
                                  <button
                                    className="ml-4 text-red-500 hover:text-red-700"
                                    onClick={() => setSelectedInvalidComplaint(complaint)}
                                  >
                                    Report as Invalid
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Form to Report Invalid Complaint */}
                        {selectedInvalidComplaint && (
                          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-lg font-bold">Report Complaint as Invalid</h3>
                            <p><strong>Complaint ID:</strong> {selectedInvalidComplaint.id}</p>
                            <textarea
                              className="w-full mt-2 p-2 border rounded"
                              placeholder="Enter reason for marking as invalid..."
                              value={invalidReason}
                              onChange={(e) => setInvalidReason(e.target.value)}
                            />
                            <div className="mt-4">
                              <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleReportInvalid}
                              >
                                Report
                              </button>
                              <button
                                className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                onClick={() => setSelectedInvalidComplaint(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {activePage === "viewComplaintDetails" && selectedComplaint && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h2 className="text-2xl font-semibold mb-4">Complaint Details</h2>
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <p><strong>Complaint ID:</strong> {selectedComplaint.id}</p>
                        <p><strong>Date Received:</strong> {selectedComplaint.date}</p>
                        <p><strong>Status:</strong> {selectedComplaint.status}</p>
                        <p><strong>Category:</strong> {selectedComplaint.category}</p>
                        <p><strong>Location:</strong> {selectedComplaint.location}</p>
                        <p><strong>Description:</strong> {selectedComplaint.description}</p>
                      </div>
                      <button
                        onClick={() => setActivePage("reportInvalid")} // ✅ Go back to Report Invalid Complaints page
                        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Back to Report Invalid Complaints
                      </button>
                    </div>
                  )}

                 {activePage === "contactAdmin" && <ContactAdmin />}
     
        </div>
      </div>
    </div>
  );
  
}



    
