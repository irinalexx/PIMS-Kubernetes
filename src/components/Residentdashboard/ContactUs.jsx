import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-6">
        Have questions or need assistance? Reach out to us through the contact details below or send us a message.
      </p>

      {/* Contact Information */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Contact Details</h2>
        <p className="text-gray-700"><strong>Email:</strong> support@pims.com</p>
        <p className="text-gray-700"><strong>Phone:</strong> +91 98765 43210</p>
        <p className="text-gray-700"><strong>Office Address:</strong> PIMS Office, Amal Jyothi College of Engineering, Kanjirappally</p>
      </div>

      {/* Inquiry Form */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Map / Location */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Find Us Here</h2>
        <iframe
          title="PIMS Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.1626072850617!2d76.8234568!3d9.5286318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b063626ed32c771%3A0xff305e1affdbb4b4!2sAmal%20Jyothi%20College%20of%20Engineering%20Autonomous!5e0!3m2!1sen!2sin!4v1711182197634!5m2!1sen!2sin"
          width="100%"
          height="300"
          allowFullScreen=""
          loading="lazy"
          className="rounded-lg shadow-md"
        ></iframe>
      </div>
    </div>
  );
};

// ✅ Ensure the default export
export default ContactUs;
