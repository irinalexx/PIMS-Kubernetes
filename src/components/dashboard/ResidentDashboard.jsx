import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import RegisterComplaint from "./RegisterComplaint";
import ViewServices from "./ViewServices";
import ComplaintHistory from "../Residentdashboard/ComplaintHistory";
import TrackComplaint from "../Residentdashboard/TrackComplaint";
import { ref, onValue } from "firebase/database"; 
import { realtimeDb } from "../../config/firebase"; 

import {
  MdDashboard,
  MdVisibility,
  MdAddCircleOutline,
  MdHistory,
  MdContactSupport,
  MdHelp,
  MdChatBubble,
} from "react-icons/md";
import { BiBell, BiUser } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import ResidentSupport from "../Residentdashboard/ResidentSupport";
import ContactUs from "../Residentdashboard/ContactUs";
import Feedback from "../Residentdashboard/Feedback";
export default function ResidentDashboard() {
  const [activePage, setActivePage] = useState("home");
  const [showNotifications, setShowNotifications] = useState(false); 
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const complaintsRef = ref(realtimeDb, "complaints");
    const unsubscribe = onValue(complaintsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const updates = Object.keys(data).map((key) => ({
          id: key,
          category: data[key].category,
          status: data[key].status || "Pending", 
        }));
        setNotifications(updates);
      } else {
        setNotifications([]);
      }
    });

    return () => unsubscribe(); 
  }, []);

  
  const sidebarItems = [
    {
      section: "MAIN",
      items: [
        { icon: MdDashboard, label: "Dashboard", page: "home", color: "text-blue-500" },
        { icon: MdVisibility, label: "View Services", page: "services", color: "text-purple-500" },
        { icon: MdAddCircleOutline, label: "Register Complaint", page: "register-complaint", color: "text-green-500" },
      ],
    },
    {
      section: "MY ISSUES",
      items: [
        { icon: AiOutlineClockCircle, label: "Track Complaint", page: "track-complaint", color: "text-orange-500" },
        { icon: MdHistory, label: "Complaint History", page: "complaint-history", color: "text-red-500" },
      ],
    },
    {
      section: "SUPPORT",
      items: [
        { icon: MdContactSupport, label: "Contact Us", page: "contact", color: "text-teal-500" },
        { icon: MdHelp, label: "Help", page: "help", color: "text-indigo-500" },
        { icon: MdChatBubble, label: "Feedback", page: "feedback", color: "text-lime-500" },

      ],
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar (Fixed) */}
      <div className="fixed w-64 h-screen bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-blue-600">Issue Hub</h1>
        </div>
        <nav className="py-4">
          {sidebarItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="px-4 mb-2 text-sm font-semibold text-gray-500 text-left">{section.section}</h3>
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
        </nav>
      </div>

      {/* Main Content (Takes Full Page Height & Scrolls) */}
      <div className="ml-64 flex-1 h-screen overflow-auto bg-gray-50 ">
        {/* Top Navigation */}
        <div className="fixed top-0 left-64 right-0 bg-white p-4 flex justify-end items-center space-x-4 shadow-md">
          <button 
          className="p-1 text-gray-500 hover:text-gray-700">
            <BiBell className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {notifications.length}
              </span>
            )}
          </button>
          <div className="relative">
  <button 
    className="p-1 text-gray-500 hover:text-gray-700 relative" 
    onClick={() => setShowProfileMenu(!showProfileMenu)}
  >
    <BiUser className="w-6 h-6" />
  </button>

  {showProfileMenu && (
  <div className="absolute right-4 top-12 bg-white shadow-lg rounded-md p-2 w-40 z-50">
      <button 
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
        onClick={() => navigate("/user-profile")}
      >
        View Profile
      </button>
      <button 
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100" 
        onClick={() => navigate("/")}
      >
        Logout
      </button>
    </div>
  )}
</div>

        
          
          {showNotifications && (
          <div className="absolute right-8 top-16 w-64 bg-white shadow-lg rounded-md p-4 z-50">
             <h3 className="text-sm font-bold text-gray-700 mb-2">Notifications</h3>
            {notifications.length > 0 ? (
              <ul className="text-sm text-gray-600">
                {notifications.map((notif) => (
                  <li key={notif.id} className="py-1 border-b">
                    <strong>{notif.category}</strong>: {notif.status}
                  </li>
                 ))}
               </ul>
            ) : (
              <p className="text-gray-500 text-sm">No new updates</p>
            )}
          </div>
        )}
      </div>
      
        {/* Page Content (Scrollable) */}
        <div className="p-6 mt-16">
          {activePage === "home" && <HomePage />}
          {activePage === "services" && <ViewServices />}
          {activePage === "register-complaint" && <RegisterComplaint />}
          {activePage === "track-complaint" && <TrackComplaint />}
          {activePage === "complaint-history" && <ComplaintHistory />}
          {activePage === "contact" && <ContactUs/>}
          {activePage === "help" && <ResidentSupport/>}
          {activePage === "feedback" && <Feedback/>}
        </div>
      </div>
      </div>
  );
}
