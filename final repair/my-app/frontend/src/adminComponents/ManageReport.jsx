import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Topbar from "./Topbar";
import logo from "../assets/logo1.png";
import "./Customers.css"; // Reuse the CSS from Customers component

function ManageReport() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch reports when the component mounts or when a report is uploaded/deleted
  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reports/get");
      const data = await response.json();
      if (response.ok) {
        setReports(data); // Set the reports data in the state
        setFilteredReports(data); // Initially, show all reports
      } else {
        setError("Failed to fetch reports");
      }
    } catch (err) {
      setError("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();  // Fetch reports when the component mounts
  }, []);

  // Filter reports based on the search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredReports(reports); // If the search is empty, show all reports
    } else {
      const filtered = reports.filter(
        (report) =>
          report.appointmentId.description.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by appointment description
      );
      setFilteredReports(filtered);
    }
  }, [searchQuery, reports]);

  // Function to handle downloading the report
  const handleDownload = (filePath) => {
    window.location.href = `http://localhost:5000/${filePath}`; // This should be the correct file path
  };

  return (
    <div className="dashboard-container">
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
          <li className="menu-item">
            <NavLink to="/technicians" className="text-decoration-none text-white">
              Manage Technicians
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/CreateServices" className="text-decoration-none text-white">
              Manage Services
            </NavLink>
          </li>
          <li className="menu-item active">
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

      <div className="main-content">
        <Topbar setSearchQuery={setSearchQuery} />
        <div className="report-management">
          <h2 className="report-title text-center" style={{ color: "#0a3d62" }}>
            Manage Reports
          </h2>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading ? (
            <p>Loading reports...</p>
          ) : (
            <div className="table-container">
              <table className="table table-hover custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Technician Name</th>
                    <th>Description</th>
                    <th>Report</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="5">No reports found.</td>
                    </tr>
                  ) : (
                    filteredReports.map((report, index) => (
                      <tr key={report._id}>
                        <td>{index + 1}</td>
                        <td>{report.technicianId.name}</td>
                        <td>{report.appointmentId.description}</td>
                        <td>{report.fileName}</td>
                        <td>
                          <a
                            href="#"
                            onClick={() => handleDownload(report.file)}  // Ensure report.file has the correct path
                            className="btn btn-sm btn-danger"
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageReport;
