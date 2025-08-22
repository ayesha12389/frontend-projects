import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Topbar from "./adminComponents/Topbar";
import logo from "./assets/logo1.png";
import "./Admin.css"; // Assuming you have a custom CSS file for Admin

function Admin() {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalTechnicians, setTotalTechnicians] = useState(null);
  const [totalServices, setTotalServices] = useState(null);
  const [totalCategories, setTotalCategories] = useState(null);
  const [totalReports, setTotalReports] = useState(null);  // Total Reports state
  const [totalMessages, setTotalMessages] = useState(null); // Total Messages state
  const [searchQuery, setSearchQuery] = useState("");  // Search query state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      // Fetch all the data for customers, technicians, services, categories, reports, and messages
      try {
        const usersResponse = await axios.get("http://localhost:5000/api/users/customers");
        const techniciansResponse = await axios.get("http://localhost:5000/api/users/technicians");
        const servicesResponse = await axios.get("http://localhost:5000/api/services");
        const categoriesResponse = await axios.get("http://localhost:5000/api/categories");
        const reportsResponse = await axios.get("http://localhost:5000/api/reports/get");  // Fetch total reports
        const messagesResponse = await axios.get("http://localhost:5000/api/contact-form/messages");  // Fetch total messages

        setTotalUsers(usersResponse.data.length);
        setTotalTechnicians(techniciansResponse.data.length);
        setTotalServices(servicesResponse.data.length);
        setTotalCategories(categoriesResponse.data.length);
        setTotalReports(reportsResponse.data.length);  // Set the total reports count
        setTotalMessages(messagesResponse.data.length);  // Set the total messages count
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Function to filter cards based on partial matches of the search query
  const filterCards = (query) => {
    if (!query) return true; // If the query is empty, return true to show all cards

    const lowerQuery = query.toLowerCase(); // Convert query to lowercase

    // Check if the search query is a prefix of any card label
    return (
      (lowerQuery === "cu" || lowerQuery.startsWith("cu")) && totalUsers !== null || // "cu" or starts with "cu"
      (lowerQuery === "te" || lowerQuery.startsWith("te")) && totalTechnicians !== null || // "te" or starts with "te"
      (lowerQuery === "se" || lowerQuery.startsWith("se")) && totalServices !== null || // "se" or starts with "se"
      (lowerQuery === "ca" || lowerQuery.startsWith("ca")) && totalCategories !== null || // "ca" or starts with "ca"
      (lowerQuery === "re" || lowerQuery.startsWith("re")) && totalReports !== null || // "re" or starts with "re"
      (lowerQuery === "me" || lowerQuery.startsWith("me")) && totalMessages !== null // "me" or starts with "me"
    );
  };

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
            <NavLink to="/manage-reports" className="text-decoration-none text-white">Manage Reports</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/categories" className="text-decoration-none text-white">Manage Categories</NavLink>
          </li>
          <li className="menu-item">
             <NavLink to="/manage-messages" className="text-decoration-none text-white">
              Manage Messages
             </NavLink>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <Topbar setSearchQuery={setSearchQuery} /> {/* Pass setSearchQuery to Topbar */}

        <h1 className="welcome-text">Welcome to the Admin Dashboard</h1>

        <div className="container my-4">
          <div className="row">
            {/* Conditionally Render Cards Based on Search Query */}
            {(searchQuery === "" || filterCards(searchQuery)) && (
              <>
                {/* Customer Card */}
                {(searchQuery === "" || searchQuery.toLowerCase().startsWith("cu")) && (
                  <div className="col-12 col-sm-6 col-md-4 mb-4" onClick={() => navigate("/customers")} style={{ cursor: "pointer" }}>
                    <div className="card text-white bg-warning text-center p-3 h-100">
                      <i className="bi bi-people-fill display-5" style={{ color: "#0a3d62" }}></i>
                      <div className="card-body">
                        <h5 className="card-title">Total Customers</h5>
                        <p className="card-text fs-4">{totalUsers !== null ? totalUsers : "Loading..."}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technician Card */}
                {(searchQuery === "" || searchQuery.toLowerCase().startsWith("te")) && (
                  <div className="col-12 col-sm-6 col-md-4 mb-4" onClick={() => navigate("/technicians")} style={{ cursor: "pointer" }}>
                    <div className="card text-white bg-warning text-center p-3 h-100">
                      <i className="bi bi-wrench-adjustable display-5" style={{ color: "#0a3d62" }}></i>
                      <div className="card-body">
                        <h5 className="card-title">Total Technicians</h5>
                        <p className="card-text fs-4">{totalTechnicians !== null ? totalTechnicians : "Loading..."}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Card */}
                {(searchQuery === "" || searchQuery.toLowerCase().startsWith("se")) && (
                  <div className="col-12 col-sm-6 col-md-4 mb-4" onClick={() => navigate("/CreateServices")} style={{ cursor: "pointer" }}>
                    <div className="card text-white bg-warning text-center p-3 h-100">
                      <i className="bi bi-tools display-5" style={{ color: "#0a3d62" }}></i>
                      <div className="card-body">
                        <h5 className="card-title">Total Services</h5>
                        <p className="card-text fs-4">{totalServices !== null ? totalServices : "Loading..."}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Card */}
                {(searchQuery === "" || searchQuery.toLowerCase().startsWith("ca")) && (
                  <div className="col-12 col-sm-6 col-md-4 mb-4" onClick={() => navigate("/categories")} style={{ cursor: "pointer" }}>
                    <div className="card text-white bg-warning text-center p-3 h-100">
                      <i className="bi bi-folder display-5" style={{ color: "#0a3d62" }}></i>
                      <div className="card-body">
                        <h5 className="card-title">Total Categories</h5>
                        <p className="card-text fs-4">{totalCategories !== null ? totalCategories : "Loading..."}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Report Card */}
                {(searchQuery === "" || searchQuery.toLowerCase().startsWith("re")) && (
                  <div className="col-12 col-sm-6 col-md-4 mb-4" onClick={() => navigate("/manage-reports")} style={{ cursor: "pointer" }}>
                    <div className="card text-white bg-warning text-center p-3 h-100">
                      <i className="bi bi-file-earmark-text display-5" style={{ color: "#0a3d62" }}></i>
                      <div className="card-body">
                        <h5 className="card-title">Total Reports</h5>
                        <p className="card-text fs-4">{totalReports !== null ? totalReports : "Loading..."}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Card */}
                {(searchQuery === "" || searchQuery.toLowerCase().startsWith("me")) && (
                  <div className="col-12 col-sm-6 col-md-4 mb-4" onClick={() => navigate("/manage-messages")} style={{ cursor: "pointer" }}>
                    <div className="card text-white bg-warning text-center p-3 h-100">
                      <i className="bi bi-envelope display-5" style={{ color: "#0a3d62" }}></i>
                      <div className="card-body">
                        <h5 className="card-title">Total Messages</h5>
                        <p className="card-text fs-4">{totalMessages !== null ? totalMessages : "Loading..."}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
