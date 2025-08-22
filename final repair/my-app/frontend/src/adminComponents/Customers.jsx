import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import logo from "../assets/logo1.png";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blocking, setBlocking] = useState(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(""); // Initialize search query

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const userToken = localStorage.getItem("token");
        if (!userToken) {
          throw new Error("🚨 No token found. Please log in.");
        }

        const response = await fetch(`http://localhost:5000/api/users/customers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        const responseText = await response.text();
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Server did not return JSON. Response: ${responseText}`);
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${responseText}`);
        }

        const customers = JSON.parse(responseText);
        setCustomers(customers);
        setFilteredCustomers(customers);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Update filtered customers whenever the search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const blockCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to block this customer?")) return;
  
    setBlocking(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: Please log in.");
        navigate("/login");
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/users/block/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      // Update the customer state immediately to reflect the change
      setCustomers((prevCustomers) => {
        return prevCustomers.map((customer) =>
          customer._id === id ? { ...customer, blocked: true } : customer
        );
      });
  
      setFilteredCustomers((prevCustomers) => {
        return prevCustomers.map((customer) =>
          customer._id === id ? { ...customer, blocked: true } : customer
        );
      });
  
      alert("Customer blocked successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setBlocking(null);
    }
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
          <li className="menu-item active">
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

      <div className="main-content">
        <Topbar setSearchQuery={setSearchQuery} />
        <div className="customer-management">
          <h2 className="customer-title" style={{ color: "#0a3d62" }}>Manage Customers</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading ? (
            <p>Loading customers...</p>
          ) : filteredCustomers.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <div className="table-container">
              <table className="table table-hover custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone no</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr key={customer._id}>
                      <td>{index + 1}</td>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.address || "N/A"}</td>
                      <td>{customer.phone || "N/A"}</td>
                      <td>
                     <button
                     className="btn btn-sm btn-danger"
                     onClick={() => blockCustomer(customer._id)}
                     disabled={blocking === customer._id || customer.blocked} // Disable if already blocked or being blocked
                    >
                  {blocking === customer._id ? "Blocking..." : customer.blocked ? "Blocked" : "Block"}
               </button>
                </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customers;
