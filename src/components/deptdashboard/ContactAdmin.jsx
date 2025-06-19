import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaUpload } from "react-icons/fa";
import { Button } from "../ui/button"; 
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

const ContactAdmin = () => {
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Support request sent: ${issueType} - ${message}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>

      <div className="mb-4">
        <p className="flex items-center"><FaPhoneAlt className="mr-2 text-blue-500" /> <strong>Admin:</strong> +91 8714737610</p>
        <p className="flex items-center">
  <FaEnvelope className="mr-2 text-red-500" /> 
  <strong>Email:</strong>  
  <a href="mailto:irinalexx2003@gmail.com" className="text-blue-500 hover:underline ml-1">
  irinalexx2003@gmail.com
  </a>
</p>
        <p><strong>Working Hours:</strong> Mon-Fri, 9 AM - 6 PM</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="font-medium">Issue Type:</span>
          <select 
            value={issueType} 
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select an issue</option>
            <option value="Technical Bug">Technical Bug</option>
            <option value="Complaint Issue">Complaint Issue</option>
            <option value="General Query">General Query</option>
          </select>
        </label>

        <label className="block">
          <span className="font-medium">Describe Your Issue:</span>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter details here..."
          />
        </label>

        <label className="block">
          <p>**To attach screenshot please send an email with the screenshot and details of the issue that you are facing.**</p>
        </label>

        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit Request
        </Button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Frequently Asked Questions</h3>
        <ul className="list-disc pl-4 text-gray-700">
          <li><strong>How do I update a complaint status?</strong> - Ensure you have admin privileges and refresh the page.</li>
          <li><strong>Why is my complaint not showing?</strong> - It may still be in verification. Check the "Pending Complaints" section.</li>
          <li><strong>How to contact higher authorities?</strong> - Use the provided admin email or contact number.</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactAdmin;
