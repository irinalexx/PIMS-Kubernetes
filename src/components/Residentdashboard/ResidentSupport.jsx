import React from "react";
import { useNavigate } from "react-router-dom";


const ResidentSupport = () => {
    const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Help Center</h1>
      <p className="text-lg text-gray-700 mb-6">
        Find answers to common questions and learn how to use our platform effectively.
      </p>

      {/* General FAQs */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">General FAQs</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>What is the Public Issue Management System (PIMS)?</li>
          <li>Who can use this platform?</li>
          <li>How do I sign up for an account?</li>
        </ul>
      </div>

      {/* Complaint Process FAQs */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Complaint Process</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>How do I submit a complaint?</li>
          <li>What types of complaints can I register?</li>
          <li>How long does it take to process a complaint?</li>
        </ul>
      </div>

      {/* Tracking & Resolution FAQs */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Tracking & Resolution</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>How can I check the status of my complaint?</li>
          <li>What happens after a complaint is submitted?</li>
          <li>What should I do if my complaint is not resolved?</li>
        </ul>
      </div>

      {/* Troubleshooting Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Troubleshooting</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>I'm unable to log in. What should I do?</li>
          <li>Why am I not receiving complaint updates?</li>
          <li>How do I reset my password?</li>
        </ul>
      </div>

      {/* Need More Help? */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Need More Help?</h2>
        <p className="text-gray-700"> If you need further assistance, please visit our{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => {
                navigate("/contact-us");  
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    window.location.reload(); // ✅ Forces re-render to ensure scrolling
                }, 100);
            }}>
            
            Contact Us
          </span>{" "}
          page.
        </p>
      </div>
    </div>
  );
};

// ✅ Ensure the default export
export default ResidentSupport;
