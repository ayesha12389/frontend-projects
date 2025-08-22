import React, { useState } from "react";
import "./UserProfile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo1.png";
import profilePic from "../assets/feature-2.jpg";
import { Link } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingAppointments = [
    { title: "Wiring Repair", date: "15 Jan 2025", status: "Confirmed" },
    { title: "Lighting Upgrade", date: "18 Jan 2025", status: "Pending" },
  ];

  const pastServices = [
    { title: "Fan Motor Repair", date: "05 Dec 2024", status: "Completed" },
    { title: "Socket Installation", date: "10 Nov 2024", status: "Completed" },
  ];

  return (
    <div>    {/* Responsive Navbar */}
    <nav className="navbar navbar-expand-lg  px-3"  style={{ backgroundColor: "#0a3d62" }}>
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
        <img src={logo} alt="Logo" className="logo-img" />
        <span className="logo-text">Smart Electric Workshop</span>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
        <li className="nav-item">
            <Link className="nav-link" to="/profile">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/services">Services</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/appointments">Appointments</Link>
          </li>
          <li className="nav-item">
            <button className="btn btn-danger ms-3">Log out</button>
          </li>
        </ul>
      </div>
    </nav>


      {/* Profile Container */}
      <div className="profile-container container mt-4">
        {/* Profile Header */}
        <div className="profile-header row align-items-center justify-content-center">
          <div className="profile-info col-12 col-md-8 d-flex flex-column align-items-center gap-3">
            <img
              src={profilePic}
              alt="Profile"
              className="rounded-circle border"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="details text-center">
              <h2>Iram Fatima</h2>
              <p>Your Dashboard</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs d-flex justify-content-center gap-2 mt-4 flex-wrap">
          <button
            className={`buttons ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Appointments
          </button>
          <button
            className={`buttons ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past Service History
          </button>
        </div>

        {/* List Container */}
        <div className="list-container mt-3">
          {activeTab === "upcoming" &&
            upcomingAppointments.map((appointment, index) => (
              <div
                key={index}
                className="list-item d-flex justify-content-between align-items-center"
              >
                <p className="mb-0">
                  {appointment.title} - {appointment.date}
                </p>
                <span className="status">{appointment.status}</span>
              </div>
            ))}

          {activeTab === "past" &&
            pastServices.map((service, index) => (
              <div
                key={index}
                className="list-item d-flex justify-content-between align-items-center"
              >
                <p className="mb-0">
                  {service.title} - {service.date}
                </p>
                <span className="status">{service.status}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
