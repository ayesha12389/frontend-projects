import React, { useState } from "react";
import "./TechOverview.css"; // Ensure proper styling for hover and layout
import profilePic from "../assets/feature-2.jpg";
import logo from "../assets/logo1.png";
import { NavLink } from "react-router-dom";
import TopbarTech from "./TopbarTech";

function Communication() {
  const [activeChat, setActiveChat] = useState(null); // Track the active customer chat

  // Example customer messages
  const customerMessages = [
    {
      id: 1,
      name: "Jane Doe",
      issue: "Appliance repair delay",
      messages: [
        { sender: "Jane Doe", text: "Hi, my appliance repair is delayed.", time: "10:00 AM" },
        { sender: "Technician", text: "Sorry for the inconvenience. We'll check it.", time: "10:05 AM" },
      ],
    },
    {
      id: 2,
      name: "John Smith",
      issue: "Pending part delivery",
      messages: [
        { sender: "John Smith", text: "When will my part be delivered?", time: "9:30 AM" },
        { sender: "Technician", text: "Expected delivery is tomorrow.", time: "9:35 AM" },
      ],
    },
    {
      id: 3,
      name: "Emily Davis",
      issue: "Repair confirmation",
      messages: [
        { sender: "Emily Davis", text: "Is the repair confirmed for today?", time: "8:45 AM" },
        { sender: "Technician", text: "Yes, we're on schedule for 2:00 PM.", time: "8:50 AM" },
      ],
    },
  ];

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
            <NavLink to="/technician" className="text-decoration-none text-white">
              Dashboard
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/workload" className="text-decoration-none text-white">
              Manage Workload
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/update" className="text-decoration-none text-white">
              Update Job Status
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/availability" className="text-decoration-none text-white">
              Set Availability
            </NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/report" className="text-decoration-none text-white">
              Upload Services Report
            </NavLink>
          </li>
          <li className="menu-item active">
            <NavLink to="/communicate" className="text-decoration-none text-white">
              Communicate with Customer
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <TopbarTech/>

        {/* Chat Sections */}
        <div className="row mt-4">
          {/* Customer List */}
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm" style={{ borderRadius: "10px" }}>
              <h5 className="mb-3">Customer Messages</h5>
              <ul className="list-group">
                {customerMessages.map((customer) => (
                  <li
                    key={customer.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      activeChat?.id === customer.id ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveChat(customer)}
                  >
                    <div>
                      <p className="mb-1 fw-bold">{customer.name}</p>
                      <small className="">{customer.issue}</small>
                    </div>
                    <button className="btn btn-sm btn-danger">Open Chat</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Box */}
          <div className="col-md-8">
            <div className="card p-3 shadow-sm h-100" style={{ borderRadius: "10px" }}>
              {activeChat ? (
                <>
                  <h5 className="mb-3">Chat with {activeChat.name}</h5>
                  <div className="chat-box" style={{ height: "300px", overflowY: "auto" }}>
                    {activeChat.messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`d-flex ${msg.sender === "Technician" ? "justify-content-end" : ""} mb-2`}
                      >
                        <div
                          className={`p-2 ${
                            msg.sender === "Technician" ? "bg-warning text-white" : "bg-light"
                          }`}
                          style={{ borderRadius: "10px", maxWidth: "70%" }}
                        >
                          <p className="mb-1">{msg.text}</p>
                          <small className="text-muted">{msg.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 d-flex">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Type your message..."
                    />
                    <button className="btn btn-warning text-white">Send</button>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted">Select a customer to start chatting.</p>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination d-flex justify-content-center mt-4">
          <button className="btn btn-outline-primary mx-1">&laquo;</button>
          <button className="btn btn-primary mx-1">1</button>
          <button className="btn btn-outline-primary mx-1">2</button>
          <button className="btn btn-outline-primary mx-1 active">3</button>
          <button className="btn btn-outline-primary mx-1">&raquo;</button>
        </div>
      </div>
    </div>
  );
}

export default Communication;
