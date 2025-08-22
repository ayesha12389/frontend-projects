import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AppointmentsPage() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  const getApiUrl = () => {
    if (!user) return null;
    if (user.role === 'admin') return `http://localhost:5000/api/appointments/all`;
    if (user.role === 'doctor') return `http://localhost:5000/api/appointments/doctor/${user.id || user._id}`;
    if (user.role === 'user') return `http://localhost:5000/api/appointments/patient/${user.id || user._id}`;
    return null;
  };

  useEffect(() => {
    const url = getApiUrl();
    if (!url) {
      setAppointments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    async function fetchAppointments() {
      try {
        const res = await axios.get(url);
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [user]);

  async function cancelAppointment(appointmentId) {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    setCancelingId(appointmentId);
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`);
      setAppointments(prev => prev.filter(appt => appt._id !== appointmentId));
      alert('Appointment canceled');
    } catch (err) {
      console.error(err);
      alert('Failed to cancel appointment');
    } finally {
      setCancelingId(null);
    }
  }

  if (loading) return <div className="text-center mt-5">Loading appointments...</div>;
  if (appointments.length === 0)
    return <div className="text-center mt-5">No appointments found.</div>;

  return (
    <div style={{ margin:'20px',maxWidth: '1200px' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Appointments</h2>

      <div className="row g-3">
        {appointments.map(appt => (
          <div className="col-12 col-sm-6 col-md-4" key={appt._id}>
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                backgroundColor: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Doctor Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <img
                  src={
                    appt.doctor?.profileImage
                      ? `http://localhost:5000/uploads/${appt.doctor.profileImage}`
                      : 'https://i.pravatar.cc/60'
                  }
                  alt={appt.doctor?.username || 'Doctor'}
                  style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                />
                <div style={{ fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                    Dr. {appt.doctor?.username || 'N/A'}
                  </div>
                  <div><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {appt.startTime} - {appt.endTime}</div>
                </div>
              </div>

              {/* Patient Info */}
              {(user.role === 'doctor' || user.role === 'admin') && appt.patient && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <img
                    src={
                      appt.patient?.profileImage
                        ? `http://localhost:5000/uploads/${appt.patient.profileImage}`
                        : 'https://i.pravatar.cc/60?u=patient'
                    }
                    alt={appt.patient?.username || 'Patient'}
                    style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                  />
                  <div style={{ fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 600 }}>{appt.patient?.username || 'N/A'}</div>
                    <div>{appt.patient?.email || ''}</div>
                  </div>
                </div>
              )}

              {/* Cancel Button */}
              <div style={{ alignSelf: 'flex-end' }}>
                <button
                  onClick={() => cancelAppointment(appt._id)}
                  disabled={cancelingId === appt._id}
                  style={{
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #dc3545',
                    color: '#dc3545',
                    backgroundColor: 'transparent',
                    cursor: cancelingId === appt._id ? 'not-allowed' : 'pointer',
                  }}
                >
                  {cancelingId === appt._id ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
