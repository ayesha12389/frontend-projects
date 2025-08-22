import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Topbar from "./Topbar";
import logo from "../assets/logo1.png";

import "./Customers.css";

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/contact-form/messages", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
        setFilteredMessages(data);
      } else {
        setError("Failed to fetch messages");
      }
    } catch (err) {
      setError("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter((msg) =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchQuery, messages]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/contact-form/messages/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          setMessages((prev) => prev.filter((msg) => msg._id !== id));
          alert("Message deleted successfully!");
        } else {
          alert("Failed to delete the message.");
        }
      } catch (err) {
        alert("Error deleting the message.");
      }
    }
  };

  const handleReply = async (email, reply) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/contact-form/reply/${selectedMessage._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ replyMessage: reply }),
        }
      );

      if (response.ok) {
        alert("Reply sent successfully!");
      } else {
        alert("Failed to send reply.");
      }
    } catch (err) {
      alert("Error sending reply.");
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
          <li className="menu-item"><NavLink to="/admin" className="text-decoration-none text-white">Dashboard</NavLink></li>
          <li className="menu-item"><NavLink to="/customers" className="text-decoration-none text-white">Manage Customers</NavLink></li>
          <li className="menu-item"><NavLink to="/technicians" className="text-decoration-none text-white">Manage Technicians</NavLink></li>
          <li className="menu-item"><NavLink to="/CreateServices" className="text-decoration-none text-white">Manage Services</NavLink></li>
          <li className="menu-item"><NavLink to="/manage-reports" className="text-decoration-none text-white">Manage Reports</NavLink></li>
          <li className="menu-item"><NavLink to="/categories" className="text-decoration-none text-white">Manage Categories</NavLink></li>
          <li className="menu-item active"><NavLink to="/manage-messages" className="text-decoration-none text-white">Manage Messages</NavLink></li>
        </ul>
      </div>

      <div className="main-content">
        <Topbar setSearchQuery={setSearchQuery} />
        <div className="message-management">
          <h2 className="message-title text-center" style={{ color: "#0a3d62" }}>
            Manage Messages
          </h2>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            <div className="table-container">
              <table className="table table-hover custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>Message</th>
                    <th>Subject</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan="7">No messages found.</td>
                    </tr>
                  ) : (
                    filteredMessages.map((message, index) => (
                      <tr key={message._id}>
                        <td>{index + 1}</td>
                        <td>{message.name}</td>
                        <td>{message.email}</td>
                        <td>{message.phone}</td>
                        <td>{message.message}</td>
                        <td>{message.subject}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => setSelectedMessage(message)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(message._id)}
                          >
                            Delete
                          </button>
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

      {/* Modal for replying */}
      {selectedMessage && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reply to Message</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedMessage(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const replyMessage = e.target.reply.value;
                    handleReply(selectedMessage.email, replyMessage);
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input type="text" className="form-control" value={selectedMessage.name} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <input type="email" className="form-control" value={selectedMessage.email} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Message</label>
                    <textarea className="form-control" rows="4" value={selectedMessage.message} readOnly></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Reply</label>
                    <textarea
                      className="form-control"
                      name="reply"
                      rows="4"
                      placeholder="Write your reply..."
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedMessage(null)}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Send Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
