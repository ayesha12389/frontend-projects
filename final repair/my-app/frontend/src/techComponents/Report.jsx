import React, { useState, useEffect } from "react";
import "./TechOverview.css";
import logo from "../assets/logo1.png";
import { NavLink } from "react-router-dom";
import TopbarTech from "./TopbarTech";
import axios from "axios"; // Import axios for making API calls

function Report() {
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState("");

  // Get technicianId from localStorage
  const technicianId = localStorage.getItem("userId"); // Assuming 'technicianId' is saved in localStorage

  useEffect(() => {
    // Fetch completed appointments for the technician
    const fetchCompletedAppointments = async () => {
      if (technicianId) {
        try {
          const response = await axios.post("http://localhost:5000/api/appointments/completed", {
            technicianId, // Send technicianId to backend
          });
          setAppointments(response.data); // Set the appointments in state
        } catch (error) {
          console.error("Error fetching completed appointments:", error);
        }
      } else {
        console.log("Technician ID not found in localStorage.");
      }
    };

    fetchCompletedAppointments();
  }, [technicianId]); // Dependency on technicianId to refetch if it changes

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploaded(true);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAppointment) {
      alert("Please select an appointment.");
      return;
    }

    const formData = new FormData();
    formData.append("file", document.getElementById("file-upload").files[0]);
    formData.append("appointmentId", selectedAppointment);
    formData.append("technicianId", technicianId);

    try {
      const response = await axios.post("http://localhost:5000/api/reports/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Report uploaded successfully!");
    } catch (error) {
      console.error("Error uploading report:", error);
      alert("Failed to upload report.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar2">
        <div className="logo-container text-center">
          <img src={logo} alt="Smart Electric Workshop" className="sidebar-logo" />
          <h3 className="sidebar-title">Smart Electric Workshop</h3>
        </div>
        <ul className="sidebar-menu list-unstyled">
          <li className="menu-item">
            <NavLink to="/technician" className="text-decoration-none text-white">
              Dashboard
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/workload" className="text-decoration-none text-white">
              Manage Workload
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/update" className="text-decoration-none text-white">
              Update Job Status
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/availability" className="text-decoration-none text-white">
              Set Availability
            </NavLink>
          </li>
          <li className="menu-item active">
            <NavLink to="/report" className="text-decoration-none text-white">
              Upload Services Report
            </NavLink>
          </li>
          {/* <li className="menu-item">
            <NavLink to="/communicate" className="text-decoration-none text-white">
              Communicate with Customer
            </NavLink>
          </li> */}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <TopbarTech />

        {/* Report Upload Section */}
        <div className="container mt-5" style={{ maxWidth: "600px" }}>
          <h4 className="text-center mb-4" style={{ color: "#0a3d62" }}>
            Upload Service Report
          </h4>
          <p className="text-center text-muted mb-4">
            Please upload a service report for the completed job. Supported formats: <strong>DOCX</strong>.
          </p>

          <div className="d-flex flex-column align-items-center">
            {/* Appointment Dropdown */}
            <div className="mb-4 w-100">
              <label htmlFor="appointmentDropdown" className="form-label">Select Completed Appointment</label>
              <select
                id="appointmentDropdown"
                className="form-select"
                value={selectedAppointment}
                onChange={(e) => setSelectedAppointment(e.target.value)}
              >
                <option value="">Select Completed Appointment</option>
                {appointments.map((appointment) => (
                  <option key={appointment._id} value={appointment._id}>
                    {appointment.description} - {appointment.appointmentDetails} - {appointment.status}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="mb-4 w-100">
              <label
                htmlFor="file-upload"
                className="btn btn-warning text-white px-4 py-2 w-100"
                style={{ cursor: "pointer", borderRadius: "20px" }}
              >
                <i className="bi bi-upload me-2"></i>Choose File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".docx"
                onChange={handleFileChange}
                className="d-none"
              />
            </div>

            {/* Uploaded File Name */}
            {uploaded ? (
              <div className="mt-4 text-center">
                <p className="fw-bold" style={{ color: "#0a3d62" }}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {fileName} has been successfully selected!
                </p>
              </div>
            ) : (
              <p className="mt-3 text-muted">No file selected</p>
            )}

            {/* Submit Button */}
            <button className="btn btn-primary mt-4 w-100" onClick={handleSubmit}>
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
