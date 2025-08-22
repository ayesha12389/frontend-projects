import React from "react";
import "./LoginForm.css";

function LoginForm() {
  // Mock data for demonstration
  const technicianData = {
    name: "Alex Johnson",
    profilePic: "https://via.placeholder.com/150",
    completedJobs: 25,
    rating: 4.8,
    assignedJobs: [
      {
        id: 1,
        service: "AC Repair",
        customer: "John Doe",
        date: "2024-12-20",
        location: "123 Main Street, New York",
        status: "In Progress",
      },
      {
        id: 2,
        service: "Electrical Fix",
        customer: "Jane Smith",
        date: "2024-12-22",
        location: "456 Elm Street, California",
        status: "Pending",
      },
    ],
  };

  return (
    <div className="technician-dashboard container my-5">
      {/* Technician Header */}
      <div className="d-flex align-items-center mb-4">
        <img
          src={technicianData.profilePic}
          alt="Technician"
          className="profile-pic rounded-circle me-3"
        />
        <div>
          <h2>Welcome, {technicianData.name}!</h2>
          <p className="text-muted">Your Dashboard</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats row mb-4">
        <div className="col-md-4">
          <div className="stat-card shadow-sm p-4 text-center rounded">
            <h4>{technicianData.completedJobs}</h4>
            <p className="text-muted">Jobs Completed</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card shadow-sm p-4 text-center rounded">
            <h4>⭐ {technicianData.rating}</h4>
            <p className="text-muted">Average Rating</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card shadow-sm p-4 text-center rounded">
            <h4>{technicianData.assignedJobs.length}</h4>
            <p className="text-muted">Active Jobs</p>
          </div>
        </div>
      </div>

      {/* Assigned Jobs */}
      <div className="assigned-jobs mb-4">
        <h4 className="mb-3">Assigned Jobs</h4>
        <div className="list-group">
          {technicianData.assignedJobs.map((job) => (
            <div
              key={job.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5 className="mb-1">{job.service}</h5>
                <p className="mb-0">
                  Customer: {job.customer} | Date: {job.date} | Location:{" "}
                  {job.location}
                </p>
              </div>
              <span
                className={`badge ${
                  job.status === "In Progress"
                    ? "bg-warning"
                    : "bg-secondary"
                }`}
              >
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4 className="mb-3">Quick Actions</h4>
        <div className="d-flex">
          <button className="btn btn-primary me-3">Update Job Status</button>
          <button className="btn btn-secondary me-3">Set Availability</button>
          <button className="btn btn-danger">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
