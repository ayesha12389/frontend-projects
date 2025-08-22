import React, { useState } from "react";
import "./Technician.css";
import logo from "./assets/logo1.png";
import TechOverview from "./techComponents/TechOverview";
import { NavLink } from 'react-router-dom';
import TopbarTech from "./techComponents/TopbarTech";

function Technician() {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (query) => {
    setSearchText(query);
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
          <li className="menu-item active">Dashboard</li>
          <li className="menu-item">
            <NavLink to="/workload" className="text-decoration-none text-white">Manage Workload</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/update" className="text-decoration-none text-white">Update job status</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/availability" className="text-decoration-none text-white">Set Availability</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/report" className="text-decoration-none text-white">Upload Services Report</NavLink>
          </li>
          {/* <li className="menu-item">
            <NavLink to="/communicate" className="text-decoration-none text-white">Communicate with Customer</NavLink>
          </li> */}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <TopbarTech onSearch={handleSearch} />
        <TechOverview searchText={searchText} />

        <div className="pagination d-flex justify-content-center mt-4">
          <button className="btn btn-outline-primary mx-1">&laquo;</button>
          <button className="btn btn-primary mx-1 active">1</button>
          <button className="btn btn-outline-primary mx-1">2</button>
          <button className="btn btn-outline-primary mx-1">3</button>
          <button className="btn btn-outline-primary mx-1">&raquo;</button>
        </div>
      </div>
    </div>
  );
}

export default Technician;
