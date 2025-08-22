import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Customers.css"; // ✅ Same CSS use hogi
import logo from "../assets/logo1.png";
import { NavLink } from "react-router-dom";
import Topbar from "./Topbar";

function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [blocking, setBlocking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found!");
        return;
    }

    axios.get("http://localhost:5000/api/users/technicians", {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
        console.log("✅ Technicians:", response.data);
        setTechnicians(response.data);
        setFilteredTechnicians(response.data); // Initialize filtered list with all technicians
    })
    .catch(error => {
        console.error("🔴 Error fetching technicians:", error);
    });
  }, []);

  // Handle search query change and filter technicians
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTechnicians(technicians);
    } else {
      const filtered = technicians.filter(
        (technician) =>
          technician.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          technician.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          technician.expertise.toLowerCase().includes(searchQuery.toLowerCase()) // Optional: include expertise for searching
      );
      setFilteredTechnicians(filtered);
    }
  }, [searchQuery, technicians]);

  // Handle blocking technician
  const blockTechnician = async (id) => {
    if (!window.confirm("Are you sure you want to block this technician?")) return;

    setBlocking(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
          alert("Unauthorized: Please log in.");
          return;
      }

      console.log(`🟢 Blocking technician: ${id}`);

      const response = await axios.put(`http://localhost:5000/api/users/block/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🔍 API Response:", response.data);
      setTechnicians(technicians.map((tech) => tech._id === id ? { ...tech, blocked: true } : tech));
      setFilteredTechnicians(filteredTechnicians.map((tech) => tech._id === id ? { ...tech, blocked: true } : tech)); // Update filtered list after blocking
      alert("Technician blocked successfully!");
    } catch (error) {
      console.error("🔴 Error blocking technician:", error);
      alert("Error blocking technician.");
    } finally {
      setBlocking(null);
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
            <NavLink to="/admin" className="text-decoration-none text-white">
              Dashboard
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/customers" className="text-decoration-none text-white">
              Manage Customers
            </NavLink>
          </li>
          <li className="menu-item active">
            <NavLink to="/technicians" className="text-decoration-none text-white">
              Manage Technicians
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/CreateServices" className="text-decoration-none text-white">
              Manage Services
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/manage-reports" className="text-decoration-none text-white">
              Manage Reports
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/categories" className="text-decoration-none text-white">
              Manage Categories
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/manage-messages" className="text-decoration-none text-white">
              Manage Messages
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <Topbar setSearchQuery={setSearchQuery} /> {/* Passing search query handler */}

        {/* Technician Table */}
        <div className="customer-management">
          <h2 className="customer-title" style={{ color: "#0a3d62" }}>Manage Technicians</h2>
          <div className="table-container">
            <table className="table table-hover custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Expertise</th>
                  <th>Phone No</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTechnicians.map((technician, index) => (
                  <tr key={technician._id}>
                    <td>{index + 1}</td>
                    <td>{technician.name}</td>
                    <td>{technician.email}</td>
                    <td>{technician.address || "N/A"}</td>
                    <td>{technician.expertise || "N/A"}</td>
                    <td>{technician.phone || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => blockTechnician(technician._id)}
                        disabled={blocking === technician._id || technician.blocked} // Disable if already blocked or being blocked
                      >
                        {blocking === technician._id ? "Blocking..." : technician.blocked ? "Blocked" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Technicians;
