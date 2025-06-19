import React, { useState } from "react";
import { Bolt, Landmark, Droplet, TreePalm, Building2 } from 'lucide-react';

export default function DepartmentsList() {
  // Department Data
  const departments = [
    {
      name: "KSEB",
      description: "Manages streetlight & power issues.",
      icon: <Bolt className="w-12 h-12 text-yellow-500" />,
      phone: "+91 98765 43210",
      email: "support@kseb.com",
    },
    {
      name: "PWD Dashboard",
      description: "Handles road maintenance & pothole repairs.",
      icon: <Landmark className="w-12 h-12 text-gray-600" />,
      phone: "+91 98765 67890",
      email: "contact@pwd.in",
    },
    {
      name: "Water Authority",
      description: "Resolves pipeline & supply complaints.",
      icon: <Droplet className="w-12 h-12 text-blue-500" />,
      phone: "+91 87654 32109",
      email: "help@waterauthority.com",
    },
    {
      name: "Forest Dept.",
      description: "Clears fallen trees & wildlife issues.",
      icon: <TreePalm className="w-12 h-12 text-green-500" />,
      phone: "+91 76543 21098",
      email: "forest@kerala.gov.in",
    },
    {
      name: "Municipality",
      description: "Manages waste disposal & sanitation.",
      icon: <Building2 className="w-12 h-12 text-red-500" />,
      phone: "+91 65432 10987",
      email: "info@municipality.in",
    },
  ];

  // State to track selected department
  const [selectedDept, setSelectedDept] = useState(null);

  const handleDeptClick = (dept) => {
    // Toggle the department details visibility
    setSelectedDept(selectedDept === dept ? null : dept);
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Departments</h2>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map((dept, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => handleDeptClick(dept)} // Toggle visibility of department details
          >
            {dept.icon}
            <h3 className="text-xl font-semibold text-gray-900 mt-4">{dept.name}</h3>
            <p className="text-sm text-gray-500">{dept.description}</p>

            {/* Toggle contact details when department is selected */}
            {selectedDept && selectedDept.name === dept.name && (
              <div className="mt-4 text-gray-700">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Phone:</span>
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Email:</span>
                    <span>{dept.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
