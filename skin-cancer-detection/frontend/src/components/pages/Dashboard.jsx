// src/pages/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // styling ko alag CSS file me rakha hai

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>SkinID</h2>
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/profile"><i className="fas fa-user"></i> Profile</Link></li>
          <li><Link to="/upload"><i className="fas fa-upload"></i> Upload</Link></li>
          <li><Link to="/result"><i className="fas fa-chart-bar"></i> Results</Link></li>
          <li><Link to="/reportlist"><i className="fas fa-file-medical-alt"></i> Reports</Link></li>
          <li><Link to="/history"><i className="fas fa-history"></i> History</Link></li>
          <li><Link to="/help"><i className="fas fa-question-circle"></i> Help</Link></li>
          <li><Link to="/"><i className="fas fa-sign-out-alt"></i> Logout</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome to Skin Cancer ID</h1>
        <p>Use the options on the left to begin analyzing, reporting, and tracking your skin health.</p>

        <div className="gallery">
          <div className="gallery-item">
            <Link to="/upload">
              <i className="fas fa-upload"></i>
            </Link>
            <h3>Upload Image</h3>
            <p>Submit a skin image for smart analysis.</p>
          </div>

          <div className="gallery-item">
            <Link to="/result">
              <i className="fas fa-chart-bar"></i>
            </Link>
            <h3>View Results</h3>
            <p>Check AI-based skin condition predictions.</p>
          </div>

          <div className="gallery-item">
            <Link to="/reportlist">
              <i className="fas fa-file-alt"></i>
            </Link>
            <h3>Download Reports</h3>
            <p>Get your complete diagnosis reports.</p>
          </div>

          <div className="gallery-item">
            <Link to="/help">
              <i className="fas fa-question-circle"></i>
            </Link>
            <h3>Help & Support</h3>
            <p>Have questions? Find help here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
