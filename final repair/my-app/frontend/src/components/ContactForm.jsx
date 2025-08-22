import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ContactForm.css"; // Custom CSS for adjustments
import axios from 'axios';
const ContactForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Send the form data to the backend
    try {
      const response = await axios.post("http://localhost:5000/api/contact-form/submit", formData);
      alert(response.data.message); // Show success message
    } catch (error) {
      alert("Error sending message. Please try again later.");
      console.error("Form submission error:", error);
    }
  
    // Clear the form fields after submission
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };
  

  return (
    <div className="contact-form-section py-5">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-5">
          <h4 className="text-warning fw-bold">Get in Touch!</h4>
          <h2 className="fw-bold" style={{ color: "#0a3d62" }}>
            Send a Message
          </h2>
          <p className="text-muted">
            Feel free to get in touch by phone or through the contact form below.
            <br />
            Your message will be sent directly to our staff who will answer as
            soon as they can.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-md-6">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Address */}
            <div className="col-md-6">
              <label className="form-label">Your Email Address *</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="col-md-6">
              <label className="form-label">Your Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subject */}
            <div className="col-md-6">
              <label className="form-label">The Subject *</label>
              <input
                type="text"
                className="form-control"
                name="subject"
                placeholder="Enter Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            {/* Message */}
            <div className="col-12">
              <label className="form-label">How can we help you? *</label>
              <textarea
                className="form-control"
                name="message"
                rows="4"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-warning text-white">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
