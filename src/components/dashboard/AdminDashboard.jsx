import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentsList from './Admindashboard features/DepartmentsList';
import { ref, onValue } from "firebase/database"; // ✅ Import Firebase Realtime Database
import { realtimeDb } from "../../config/firebase";
import AdminReports from './Admindashboard features/AdminReports';
import { BarChart as RechartsBarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Building2, 
  BarChart, 
  Settings, 
  LogOut, 
  Search,
  Filter,
  Check,
  X,
  HistoryIcon
} from 'lucide-react';
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import ComplaintsPage from './ComplaintsPage';
import TrackComplaints from './Admindashboard features/TrackComplaints';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineAttachFile,MdChatBubble } from 'react-icons/md';
import AdminFeedbacks from './Admindashboard features/AdminFeedbacks';

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();

  const [complaintCounts, setComplaintCounts] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [monthlyComplaintData, setMonthlyComplaintData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Holds the search term
  const [filteredComplaints, setFilteredComplaints] = useState([]); // ✅ Stores filtered results
  
  useEffect(() => {
    const complaintsRef = ref(realtimeDb, "complaints");
  
    onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const complaintsArray = Object.values(data);
  
        const monthlyCounts = new Array(12).fill(0);

      complaintsArray.forEach((complaint) => {
        if (complaint.timestamp) {
          const date = new Date(complaint.timestamp);
          const monthIndex = date.getMonth(); // 0 = Jan, 1 = Feb, ..., 11 = Dec
          monthlyCounts[monthIndex]++;
        }
      });

      // Convert data into recharts-friendly format
      const formattedData = monthlyCounts.map((count, index) => ({
        month: new Date(0, index).toLocaleString("default", { month: "short" }),
        count,
      }));

      setMonthlyComplaintData(formattedData);

        // Calculate counts based on status
        const total = complaintsArray.length;
        const pending = complaintsArray.filter(c => !c.status).length; // ✅ No status means pending
        const inProgress = complaintsArray.filter(c => c.status === "In Progress").length;
        const resolved = complaintsArray.filter(c => c.status === "Resolved").length;
        const rejected = complaintsArray.filter(c => c.status?.toLowerCase() === "rejected").length;
  
        setComplaintCounts({ total, pending, inProgress, resolved, rejected });
      }
    });
  }, []);
  
  

  const handleLogout = () => {
    // Perform any cleanup if needed
    navigate('/'); // ✅ Redirect to LandingPage.jsx (Assuming '/' is mapped to it)
  };

  const [complaints, setComplaints] = useState([]);


  const handleVerify = (id) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id ? { ...complaint, status: 'verified' } : complaint
    ));
  };

  const handleReject = (id) => {
    setComplaints(complaints.map(complaint => 
      complaint.id === id ? { ...complaint, status: 'rejected' } : complaint
    ));
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard', color: 'text-blue-500' },
    { icon: ClipboardList, label: 'Complaints', page: 'complaints', color: 'text-red-500' },
    { icon: HistoryIcon, label: 'Track Complaints', page: 'track-complaints', color: 'text-orange-500' },
    { icon: Building2, label: 'Departments', page: 'departments', color: 'text-green-500' },
    { icon: BarChart, label: 'Invalids', page: 'reports', color: 'text-purple-500' },
    { icon: Settings, label: 'Settings', color: 'text-gray-500' },
    { icon: MdChatBubble, label: 'Feedbacks',page: 'feedbacks', color: 'text-teal' },
  ];
  

  const quickStats = [
    { label: 'Total Complaints', value: complaintCounts.total, color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending', value: complaintCounts.pending, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'In Progress', value: complaintCounts.inProgress, color: 'bg-green-100 text-green-600' },
    { label: 'Resolved', value: complaintCounts.resolved, color: 'bg-purple-100 text-purple-600' },
    { label: 'Rejected', value: complaintCounts.rejected, color: 'bg-red-100 text-red-600' } // ✅ New entry for rejected complaints
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-md p-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-blue-600">PIMS Admin</h1>
        </div>
        {sidebarItems.map((item) => (
          <Button 
            key={item.label}
            variant={activePage === item.page ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-2"
            onClick={() => setActivePage(item.page)}
          >
          <item.icon className={`mr-2 h-4 w-4 ${item.color}`} />                    {item.label}
          
          </Button>
          
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium">ADMIN</span>
            <Button 
          variant="destructive" 
          size="sm"
          onClick={handleLogout} 
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 overflow-y-auto">
          {activePage === 'dashboard' && (
            <div>
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {quickStats.map((stat) => (
                  <Card key={stat.label} className={`${stat.color} hover:shadow-md transition-shadow`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-normal">{stat.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
             {/* Complaint Statistics Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-semibold mb-4">Complaint Statistics</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={[
                      { name: "Total", value: complaintCounts.total },
                      { name: "Pending", value: complaintCounts.pending },
                      { name: "In Progress", value: complaintCounts.inProgress },
                      { name: "Resolved", value: complaintCounts.resolved },
                      { name: "Rejected", value: complaintCounts.rejected }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
             {/* Monthly Complaints Line Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Monthly Complaints Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyComplaintData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#ff7300" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
 

            </div>
          )}
          {activePage === 'complaints' && (
            <ComplaintsPage 
              complaints={complaints} 
              onVerify={handleVerify} 
              onReject={handleReject} 
            />
          )}
          {activePage === 'departments' && <DepartmentsList />}
          {activePage === 'track-complaints' && <TrackComplaints />}
          {activePage === 'reports' && <AdminReports />}
          {activePage === 'feedbacks' && <AdminFeedbacks />}

          {/* Complaints Management */}
        
        </div>
      </div>
    </div>
  );
}
