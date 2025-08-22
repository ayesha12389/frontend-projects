import React from 'react'
import logo from "../assets/logo1.png";
import { NavLink } from "react-router-dom";
function AdminLayout() {
  return (
    <div className="dashboard-container">
      <div className="sidebar2">
        <div className="logo-container text-center">
          <img src={logo} alt="Smart Electric Workshop" className="sidebar-logo" />
          <h3 className="sidebar-title">Smart Electric Workshop</h3>
        </div>
        <ul className="sidebar-menu list-unstyled">
          <li className="menu-item active">Dashboard</li>
          <li className="menu-item">
            <NavLink to="/customers" className="text-decoration-none text-white">Manage Customers</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/technicians" className="text-decoration-none text-white">Manage Technicians</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/CreateServices" className="text-decoration-none text-white">Manage Services</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/categories" className="text-decoration-none text-white">Manage Categories</NavLink>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="topbar bg-white shadow-sm d-flex justify-content-between align-items-center p-3">
          <input type="text" placeholder="Search" className="form-control w-50" />
          <div className="topbar-icons d-flex align-items-center gap-3">
            <div className="icon-wrapper" data-count="3">
              <i className="bi bi-bell fs-4"></i>
            </div>
            <div className="text">
              <span className="ms">Notifications</span>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default AdminLayout