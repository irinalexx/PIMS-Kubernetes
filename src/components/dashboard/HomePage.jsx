import React from "react";
import { useNavigate } from "react-router-dom";
import { MdDescription } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiHelpCircle } from "react-icons/bi";
import RegisterComplaint from "./RegisterComplaint";
import TrackComplaint from "../Residentdashboard/TrackComplaint";
export default function HomePage() {
  const navigate = useNavigate();
  const features = [
    {
      icon: MdDescription,
      title: "Report Issues",
      description: "Easily report problems in your community",
      color: "text-blue-500",
      path: "/register-complaint",
    },
    {
      icon: AiOutlineClockCircle,
      title: "Track Progress",
      description: "Stay updated on the status of your reported issues",
      color: "text-green-500",
      path: "/track-complaint", 
    },
    {
      icon: BiHelpCircle,
      title: "Get Support",
      description: "Access help and resources when you need them",
      color: "text-purple-500",
      path: "/resident-support",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Public Issue Management
        </h1>
        <p className="text-xl text-gray-600">
          Empowering citizens to report and track community issues efficiently
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-6 h-full overflow-y-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center"
            onClick={() => navigate(feature.path)}
          >
            <feature.icon className={`w-16 h-16 ${feature.color} mb-4`} />
            <h2 className="text-xl font-semibold mb-2 text-center">
              {feature.title}
            </h2>
            <p className="text-base text-gray-600 text-center max-w-md">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
