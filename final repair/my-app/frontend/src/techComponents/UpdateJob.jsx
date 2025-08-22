import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopbarTech from "./TopbarTech";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo1.png";

function UpdateJob() {
  const [appointments, setAppointments] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const technicianId = localStorage.getItem("userId");

  // Define priority order for sorting
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/acceptappointments/fetch-accepted-appointments",
          { technicianId }
        );

        // Sort appointments by priority
        const sortedAppointments = response.data.sort((a, b) => {
          return (
            priorityOrder[a.appointmentId?.priority] - priorityOrder[b.appointmentId?.priority]
          );
        });

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching accepted appointments:", error);
        toast.error("Failed to fetch accepted appointments.");
      }
    };

    if (technicianId) {
      fetchAppointments();
    }
  }, [technicianId]);

  const handleSearch = (query) => {
    setSearchText(query.toLowerCase());
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      const description = appointment.appointmentId?.description?.toLowerCase() || "";
      const serviceName = appointment.appointmentId?.service?.name?.toLowerCase() || "";
      const customerName = appointment.appointmentId?.user?.name?.toLowerCase() || "";
      return (
        description.includes(searchText) ||
        serviceName.includes(searchText) ||
        customerName.includes(searchText)
      );
    })
    .sort((a, b) => {
      return (
        priorityOrder[a.appointmentId?.priority] - priorityOrder[b.appointmentId?.priority]
      );
    });

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.post("http://localhost:5000/api/appointments/update-status", {
        appointmentId,
        status: newStatus,
      });

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId._id === appointmentId
            ? {
                ...appointment,
                appointmentId: { ...appointment.appointmentId, status: newStatus },
              }
            : appointment
        )
      );

      toast.success("Status updated successfully!");
      setSelectedJobId(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
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
          <li className="menu-item"><NavLink to="/technician" className="text-decoration-none text-white">Dashboard</NavLink></li>
          <li className="menu-item"><NavLink to="/workload" className="text-decoration-none text-white">Manage Workload</NavLink></li>
          <li className="menu-item active"><NavLink to="/update" className="text-decoration-none text-white">Update Job Status</NavLink></li>
          <li className="menu-item"><NavLink to="/availability" className="text-decoration-none text-white">Set Availability</NavLink></li>
          <li className="menu-item"><NavLink to="/report" className="text-decoration-none text-white">Upload Services Report</NavLink></li>
          {/* <li className="menu-item"><NavLink to="/communicate" className="text-decoration-none text-white">Communicate with Customer</NavLink></li> */}
        </ul>
      </div>

      <div className="main-content">
        <TopbarTech onSearch={handleSearch} />

        <div className="job-cards-container mt-4">
          <h3 className="mb-2 text-center">Accepted Appointments</h3>
          <div className="row g-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="col-md-4">
                  <div className="card">
                    <img
                      src={appointment.appointmentId?.damagePartFile}
                      alt="Damage Part"
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{appointment.appointmentId?.description}</h5>
                      <p className="card-text mb-1"><strong>Customer:</strong> {appointment.appointmentId?.user?.name || 'N/A'}</p>
                      <p className="card-text mb-1"><strong>Service:</strong> {appointment.appointmentId?.service?.name || 'N/A'}</p>
                      <p className="card-text mb-1"><strong>Appointment Details:</strong> {appointment.appointmentId?.appointmentDetails}</p>
                      <p className="card-text mb-1"><strong>Priority:</strong> {appointment.appointmentId?.priority}</p>
                      <p className="card-text mb-1"><strong>Appointment Status:</strong> {appointment.appointmentId?.status}</p>
                      <button
                        className="btn btn-primary w-100 mt-3"
                        onClick={() =>
                          setSelectedJobId(
                            selectedJobId === appointment._id ? null : appointment._id
                          )
                        }
                      >
                        Update Status
                      </button>

                      {selectedJobId === appointment._id && (
                        <div className="mt-2 p-2 border rounded bg-light">
                          <p className="mb-1">Select Status:</p>
                          <button
                            className="btn btn-outline-secondary me-2"
                            onClick={() => handleStatusChange(appointment.appointmentId._id, "In Progress")}
                          >
                            in progress
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleStatusChange(appointment.appointmentId._id, "Completed")}
                          >
                            completed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No matching appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateJob;
