import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopbarTech from "./TopbarTech";
import logo from "../assets/logo1.png";
import { NavLink } from "react-router-dom";

function Workload() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [justAcceptedIds, setJustAcceptedIds] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState({}); // Track expanded details
  const technicianId = localStorage.getItem("userId");

  // Priority order for sorting: high -> medium -> low
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  // Fetch appointments and sort by priority
  useEffect(() => {
    if (technicianId) {
      axios
        .post("http://localhost:5000/api/appointments/fetch-appointments", { technicianId })
        .then((response) => {
          const fetchedAppointments = response.data;

          Promise.all(
            fetchedAppointments.map(async (appointment) => {
              try {
                const checkResponse = await axios.post(
                  "http://localhost:5000/api/acceptappointments/check-acceptance-status",
                  {
                    technicianId,
                    appointmentId: appointment._id,
                  }
                );

                return {
                  ...appointment,
                  isAccepted: justAcceptedIds.includes(appointment._id)
                    ? true
                    : checkResponse.data.isAccepted || false,
                };
              } catch (error) {
                console.error("Error checking acceptance status:", error);
                toast.error("Failed to check acceptance status.");
                return {
                  ...appointment,
                  isAccepted: false,
                };
              }
            })
          ).then((updatedAppointments) => {
            // Sorting appointments by priority
            const sortedAppointments = updatedAppointments.sort((a, b) => {
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            setAppointments(sortedAppointments);
            setFilteredAppointments(sortedAppointments); // Initialize filtered list
          });
        })
        .catch((error) => {
          console.error("Error fetching appointments:", error);
          toast.error("Failed to fetch appointments.");
        });
    }
  }, [technicianId, justAcceptedIds]);

  // Search functionality with priority sorting
  const handleSearch = (searchText) => {
    const filtered = appointments.filter((appointment) =>
      appointment.service.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Sorting the filtered appointments by priority
    const sortedFiltered = filtered.sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    setFilteredAppointments(sortedFiltered);
  };

  const handleAcceptAppointment = (appointmentId) => {
    const technicianId = localStorage.getItem("userId");

    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, isAccepted: true, status: "Accepted" }
          : appointment
      )
    );
    setJustAcceptedIds((prev) => [...prev, appointmentId]);

    axios
      .post("http://localhost:5000/api/acceptappointments/accept-appointment", {
        technicianId,
        appointmentId,
      })
      .then(() => {
        toast.success("Appointment accepted successfully!");
      })
      .catch((error) => {
        console.error("Error accepting appointment:", error);
        alert("Appointment accepted successfully");

        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, isAccepted: false, status: "Pending" }
              : appointment
          )
        );
        setJustAcceptedIds((prev) => prev.filter((id) => id !== appointmentId));
      });
  };

  const toggleDetails = (appointmentId) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [appointmentId]: !prev[appointmentId], // Toggle the visibility of details for this appointment
    }));
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
            <NavLink to="/technician" className="text-decoration-none text-white">
              Dashboard
            </NavLink>
          </li>
          <li className="menu-item active">
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
        </ul>
      </div>

      <div className="main-content">
        <TopbarTech onSearch={handleSearch} />

        <div className="job-cards-container mt-4">
          <h3 className="mb-2 text-center">Upcoming Appointments</h3>
          <div className="row g-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="col-md-4">
                  <div className="card">
                    <img
                      src={appointment.damagePartFile}
                      alt="Damage Part"
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{appointment.description}</h5>
                      <p className="card-text mb-1">
                        <strong>Service Name:</strong> {appointment.service.name}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Customer:</strong> {appointment.user.name}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Location:</strong> {appointment.user.address}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Appointment Details:</strong> {appointment.appointmentDetails}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Priority:</strong> {appointment.priority}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Appointment Status:</strong> {appointment.status}
                      </p>
                      {/* "More Details" link with down/up arrow */}
                      <a
                        href="#"
                        className="text-info w-100 mt-3"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleDetails(appointment._id);
                        }}
                      >
                        {expandedDetails[appointment._id] ? "↑ Less Details" : "More Details"}
                      </a>

                      {/* Show customer details if expanded */}
                      {expandedDetails[appointment._id] && (
                        <div className="customer-details mt-2">
                          <p>
                            <strong>Phone: </strong> {appointment.user.phone || "N/A"}
                          </p>
                          <p>
                            <strong>Email: </strong> {appointment.user.email || "N/A"}
                          </p>
                        </div>
                      )}

                      {appointment.isAccepted ? (
                        <button className="btn btn-primary w-100 mt-3">
                          Accepted
                        </button>
                      ) : (
                        <button
                          className="btn btn-success w-100 mt-3"
                          onClick={() => handleAcceptAppointment(appointment._id)}
                        >
                          Accept
                        </button>
                      )}

                      
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workload;
