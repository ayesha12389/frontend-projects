import React, { useState, useEffect } from 'react';
import NavbarUser from './NavbarUser';
import FooterSection from './FooterSection';
import axios from 'axios';

function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const userId = localStorage.getItem('userId');
  const [feedback, setFeedback] = useState({});
  const [rating, setRating] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/appointments/user', {
          userId: userId,
        });
        setAppointments(response.data);

        const initialFeedback = {};
        const initialRating = {};
        const initialSubmittedFeedback = {};

        // Retrieve submitted feedback status from localStorage
        const storedSubmittedFeedback = JSON.parse(localStorage.getItem('submittedFeedback')) || {};

        response.data.forEach(appointment => {
          if (appointment.feedback) {
            initialFeedback[appointment._id] = appointment.feedback;
          }
          if (appointment.rating) {
            initialRating[appointment._id] = appointment.rating;
          }
          if (storedSubmittedFeedback[appointment._id]) {
            initialSubmittedFeedback[appointment._id] = true;
          }
        });

        setFeedback(initialFeedback);
        setRating(initialRating);
        setSubmittedFeedback(initialSubmittedFeedback);
      } catch (error) {
        console.error("Error fetching appointment history:", error);
      }
    };

    if (userId) {
      fetchAppointments();
    }
  }, [userId]);

  const handleFeedbackChange = (e, appointmentId) => {
    setFeedback((prev) => ({
      ...prev,
      [appointmentId]: e.target.value,
    }));
  };

  const handleRatingChange = (appointmentId, index) => {
    setRating((prev) => ({
      ...prev,
      [appointmentId]: index + 1,
    }));
  };

  const submitFeedback = async (appointmentId) => {
    if (!feedback[appointmentId] || !rating[appointmentId]) {
      setError('Please provide both feedback and rating.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/appointments/submit-feedback', {
        appointmentId,
        feedback: feedback[appointmentId],
        rating: rating[appointmentId],
      });

      // Update the submittedFeedback state and localStorage
      setSubmittedFeedback((prev) => {
        const updated = { ...prev, [appointmentId]: true };
        localStorage.setItem('submittedFeedback', JSON.stringify(updated));
        return updated;
      });

      // 👇 Update appointments state locally so UI reflects changes instantly
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt._id === appointmentId
            ? {
                ...appt,
                feedback: feedback[appointmentId],
                userRating: rating[appointmentId],
              }
            : appt
        )
      );

      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError('There was an error submitting your feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Sort appointments: Pending/In-Progress appointments first, then Completed appointments with no feedback
  const sortedAppointments = appointments
    .sort((a, b) => {
      // Priority: show "Pending" or "In-progress" appointments first
      if (a.status !== "Completed" && b.status === "Completed") {
        return -1; // a comes first
      }
      if (b.status !== "Completed" && a.status === "Completed") {
        return 1; // b comes first
      }

      // After completed appointments, prioritize those without feedback
      if (a.status === "Completed" && !a.feedback && b.status === "Completed" && !b.feedback) {
        return 0;
      }
      if (a.status === "Completed" && !a.feedback) {
        return -1; // a comes first (not yet submitted feedback)
      }
      if (b.status === "Completed" && !b.feedback) {
        return 1; // b comes first (not yet submitted feedback)
      }

      return 0; // No change if both are the same
    });

  return (
    <div>
      <NavbarUser />
      <div className="image-section">
        <div className="image-overlay">
          <div className="text-content text-center">
            <h1 className="image-title">Appointment History</h1>
            <p className="image-subtitle">Check out your booked appointment history now.</p>
          </div>
        </div>
      </div>

      <div className="appointment-history-container container mt-5">
        {sortedAppointments.length > 0 ? (
          sortedAppointments.map((appointment) => (
            <div key={appointment._id} className="row g-3 mb-4" style={{ borderRadius: '10px', overflow: 'hidden' }}>
              {/* Left side: Appointment Details */}
              <div className="col-md-6" style={{ backgroundColor: '#f7f7f7', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                <div
                  className="p-4"
                  style={{
                    background: '#ffffff',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '100%',
                  }}
                >
                  <h5 style={{ fontWeight: '600', color: '#2c3e50' }}>🗓️ Appointment Date</h5>
                  <p>{appointment.appointmentDetails}</p>

                  {appointment.damagePartFile && (
                    <>
                      <hr />
                      <img
                        src={appointment.damagePartFile}
                        alt="Damage Part"
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: '180px', objectFit: 'cover' }}
                      />
                    </>
                  )}

                  <p><strong>🔧 Service:</strong> {appointment.service?.name || 'N/A'}</p>
                  <p><strong>📝 Description:</strong> {appointment.description}</p>
                  <p><strong>📌 Status:</strong> {appointment.status}</p>
                  <p style={{ marginBottom: '4px' }}><strong>💬 Feedback:</strong> {appointment.feedback}</p>
                  <h6 style={{ marginTop: '13px' }}><strong>☆ Rating:</strong> {appointment.userRating} / 5</h6>

                  <div className="stars">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: '25px',
                          color: appointment.userRating >= index + 1 ? '#f39c12' : '#ccc',
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Displaying Rating and Feedback in the Appointment Details Section */}
                  {appointment.status === "Completed" && !submittedFeedback[appointment._id] && (
                    <div className="mt-3">
                      <h5>Provide Feedback</h5>
                      <div className="rating-section mb-3">
                        <label className="form-label">Rating (1-5):</label>
                        <div className="stars">
                          {[...Array(5)].map((_, index) => (
                            <span
                              key={index}
                              onClick={() => handleRatingChange(appointment._id, index)}
                              style={{
                                fontSize: '25px',
                                cursor: 'pointer',
                                color: (rating[appointment._id] || appointment.rating || 0) > index ? '#f39c12' : '#ccc',
                                transition: 'color 0.2s',
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3" style={{ fontSize: '14px' }}>
                        <label htmlFor={`feedback-${appointment._id}`} className="form-label">Feedback:</label>
                        <textarea
                          id={`feedback-${appointment._id}`}
                          className="form-control"
                          rows="3"
                          value={feedback[appointment._id] || ""}
                          onChange={(e) => handleFeedbackChange(e, appointment._id)}
                          style={{ fontSize: '14px' }}
                        />
                      </div>

                      {error && <div className="alert alert-danger">{error}</div>}

                      <button
                        className="btn btn-primary"
                        onClick={() => submitFeedback(appointment._id)}
                        disabled={!feedback[appointment._id] || !rating[appointment._id] || loading}
                      >
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side: Technician Details */}
              <div className="col-md-6 d-flex align-items-center justify-content-center p-4" style={{ background: '#0a3d62', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
                <div className="text-center">
                  <h5 className="text-white" style={{ fontWeight: '600', fontFamily: 'Arial, sans-serif' }}>Technician Details</h5>
                  {appointment.technician?.imageUrl && (
                    <img
                      src={appointment.technician.imageUrl}
                      alt="Technician"
                      className="img-fluid rounded-circle mb-3"
                      style={{ maxWidth: '150px', border: '3px solid white' }}
                    />
                  )}
                  <p className="text-white" style={{ fontFamily: 'Arial, sans-serif' }}><strong>Technician:</strong> {appointment.technician?.name || 'N/A'}</p>
                  <p className="text-white" style={{ fontFamily: 'Arial, sans-serif' }}><strong>Phone:</strong> {appointment.technician?.phone || 'N/A'}</p>
                  <p className="text-white" style={{ fontFamily: 'Arial, sans-serif' }}><strong>Email:</strong> {appointment.technician?.email || 'N/A'}</p>
                  <p className="text-white" style={{ fontFamily: 'Arial, sans-serif' }}><strong>Address:</strong> {appointment.technician?.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No appointment history found.</p>
        )}
      </div>

      <FooterSection />
    </div>
  );
}

export default AppointmentHistory;
