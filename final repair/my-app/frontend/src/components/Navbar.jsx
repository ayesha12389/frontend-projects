import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/logo1.png';

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <header className="header">
        <nav className="navbar navbar-expand-lg navbar-dark container">
          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="Logo" className="logo-image me-2" />
            <h1 className="mb-0 fs-4 text-white">Smart Electric Workshop</h1>
          </a>

          {/* Hamburger Menu Button (Visible on small screens) */}
          <button
            className="navbar-toggler text-white"
            type="button"
            onClick={toggleSidebar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Normal Navbar Links (Visible on larger screens) */}
          <div className="collapse navbar-collapse d-lg-flex justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link text-white" href="/">Home</a>
              </li>
              <li className="nav-item">
                {/* <a className="nav-link text-white" href="/services">Services</a> */}
              </li>
              <li className="nav-item">
                {/* <a className="nav-link text-white" href="/appointments">Appointments</a> */}
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/about">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/contact">Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/login">Login</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Sidebar (Visible on small screens when toggled) */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <ul className="sidebar-links">
          <li>
            <a href="/" onClick={toggleSidebar}>Home</a>
          </li>
          <li>
            <a href="/services" onClick={toggleSidebar}>Services</a>
          </li>
          <li>
            <a href="/appointments" onClick={toggleSidebar}>Appointments</a>
          </li>
          <li>
            <a href="/about" onClick={toggleSidebar}>About Us</a>
          </li>
          <li>
            <a href="/contact" onClick={toggleSidebar}>Contact</a>
          </li>
          <li>
            <a href="/profile" onClick={toggleSidebar}>Login</a>
          </li>
        </ul>
      </div>

      {/* Overlay to close sidebar */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}

export default Header;
