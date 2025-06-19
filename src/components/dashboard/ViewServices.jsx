import React from "react";
import { FaBolt, FaRoad, FaTint, FaTree, FaPaw } from "react-icons/fa";

const services = [
  {
    icon: <FaBolt className="text-yellow-500 w-10 h-10" />,
    name: "Streetlight & Electrical Issues",
    department: "KSEB",
    description: "Fixing faulty streetlights, repairing electrical poles & wiring, and resolving power-related complaints.",
  },
  {
    icon: <FaRoad className="text-gray-700 w-10 h-10" />,
    name: "Road Infrastructure Issues",
    department: "PWD",
    description: "Repairing potholes, fixing broken footpaths, and clearing road obstructions.",
  },
  {
    icon: <FaTint className="text-blue-500 w-10 h-10" />,
    name: "Water & Pipeline Issues",
    department: "Water Authority",
    description: "Fixing broken pipelines, addressing water contamination, and resolving low water supply issues.",
  },
  {
    icon: <FaTree className="text-green-500 w-10 h-10" />,
    name: "Vegetation & Environmental Issues",
    department: "Municipality",
    description: "Cutting overgrown vegetation, clearing fallen trees after storms, and managing waste collection.",
  },
  {
    icon: <FaPaw className="text-red-500 w-10 h-10" />,
    name: "Wildlife Disturbance Reporting",
    department: "Forest",
    description: "Report incidents of wild animals entering residential areas or damaging farms.",
  },
];

export default function ViewServices() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">🔹 Services Offered</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              {service.icon}
              <h3 className="text-lg font-semibold">{service.name}</h3>
            </div>
            <p className="mt-2 text-gray-600">{service.description}</p>
            <p className="mt-1 text-sm text-gray-500">🛠 Managed by: <strong>{service.department}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
