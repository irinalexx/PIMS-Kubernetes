import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import LandingPage from './components/LandingPage';
import ResidentAuth from './components/ResidentAuth';
import AdminLogin from './components/AdminLogin';
import DepartmentLogin from './components/DepartmentLogin';
import ResidentDashboard from './components/dashboard/ResidentDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import PWDDashboard from './components/deptdashboard/PWDDashboard';
import WaterDashboard from './components/deptdashboard/WaterDashboard';
import ForestDashboard from './components/deptdashboard/ForestDashboard';
import KSEBDashboard from './components/deptdashboard/KSEBDashboard';
import DepartmentsList from './components/dashboard/Admindashboard features/DepartmentsList';
import TrackComplaints from './components/dashboard/Admindashboard features/TrackComplaints';
import ComplaintHistory from './components/Residentdashboard/ComplaintHistory';
import TrackComplaint from './components/Residentdashboard/TrackComplaint';
import MuncipalityDashboard from './components/deptdashboard/MuncipalityDashboard';
import RegisterComplaint from "./components/dashboard/RegisterComplaint"; 
import ResidentSupport from "./components/Residentdashboard/ResidentSupport"; 
import ContactUs from './components/Residentdashboard/ContactUs';
import UserProfile from './components/Residentdashboard/UserProfile';
import AdminReports from './components/dashboard/Admindashboard features/AdminReports';
import ContactAdmin from './components/deptdashboard/ContactAdmin';
import AdminFeedbacks from './components/dashboard/Admindashboard features/AdminFeedbacks';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resident-login" element={<ResidentAuth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/worker-login" element={<DepartmentLogin />} />
          <Route path="/register-complaint" element={<RegisterComplaint />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="/resident-support" element={<ResidentSupport />} />

          <Route 
            path="/resident-dashboard" 
            element={
              <ProtectedRoute>
                <ResidentDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/deptdashboard/PWDDashboard" 
            element={<AdminProtectedRoute>
              <PWDDashboard />
            </AdminProtectedRoute>
            } 
          />

          <Route 
              path="/deptdashboard/WaterDashboard" 
              element={
                <AdminProtectedRoute>
                  <WaterDashboard />
                </AdminProtectedRoute>
              } 
          />
          <Route 
              path="/deptdashboard/MuncipalityDashboard" 
              element={
                <AdminProtectedRoute>
                  <MuncipalityDashboard />
                </AdminProtectedRoute>
              } 
          />
          <Route 
              path="/deptdashboard/KSEBDashboard" 
              element={
                <AdminProtectedRoute>
                  <KSEBDashboard />
                </AdminProtectedRoute>
              } 
          />
          <Route path="/contact-us" element={<ContactUs />} /> 
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/contact-admin" element={<ContactAdmin />} />

          <Route 
              path="/deptdashboard/ForestDashboard" 
              element={
                <AdminProtectedRoute>
                  <ForestDashboard />
                </AdminProtectedRoute>
              } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}


export default App
