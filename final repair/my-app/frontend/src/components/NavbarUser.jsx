import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./NavbarUser.css";

function NavbarUser() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "https://via.placeholder.com/50");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar State

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      axios
        .get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { name, imageUrl } = response.data;
          if (name) {
            setUserName(name);
            localStorage.setItem("userName", name);
          }
          if (imageUrl) {
            setProfileImage(imageUrl);
            localStorage.setItem("profileImage", imageUrl);
          }
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg px-3 custom-navbar">
        <button className="btn btn-outline-light me-3 d-lg-none" onClick={() => setSidebarOpen(true)}>
          <i className="bi bi-list fs-3"></i> {/* Hamburger Icon for Mobile */}
        </button>

        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Smart Electric Workshop</span>
        </Link>

        {/* Navbar Links for Larger Screens */}
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link text-white" to="/HeroAfterLogin">🏠 Home</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/services">🔧 Services</Link></li>
            <li className="nav-item"><Link className="nav-link text-white" to="/appointment-history">📅Appointment History</Link></li> 
          </ul>

          {/* User Profile Dropdown */}
          <ul className="navbar-nav ms-3 align-items-center">
            <li className="nav-item dropdown">
              <button className="btn d-flex align-items-center text-white" data-bs-toggle="dropdown">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-circle border me-2"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <b>Hello, {userName} 👋</b>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => navigate("/Profile")}>Profile</button></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* Sidebar for Mobile */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setSidebarOpen(false)}>
          &times;
        </button>
        <ul className="sidebar-links">
          <li><Link to="/HeroAfterLogin" onClick={() => setSidebarOpen(false)}>🏠 Home</Link></li>
          <li><Link to="/services" onClick={() => setSidebarOpen(false)}>🔧 Services</Link></li>
          <li><Link to="/appointment-history" onClick={() => setSidebarOpen(false)}>📅 Appointment History</Link></li>
          <li><Link to="/Profile" onClick={() => setSidebarOpen(false)}>👤 Profile</Link></li>
          <li><button className="nav-link btn text-danger" onClick={handleLogout}>🚪 Logout</button></li>
        </ul>
      </div>

      {/* Overlay to close sidebar */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
}

export default NavbarUser;  