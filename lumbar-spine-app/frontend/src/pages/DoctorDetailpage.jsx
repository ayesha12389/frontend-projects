import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const WORKING_HOURS = { startTime: "09:00", endTime: "17:00", slotLength: 30 };
const WORKING_DAYS = [0, 1, 2, 3, 4, 5, 6];

function generateTimeSlots({ startTime, endTime, slotLength }) {
  const slots = [];
  const [h0, m0] = startTime.split(':').map(Number);
  const [h1, m1] = endTime.split(':').map(Number);
  let current = h0 * 60 + m0;
  const end = h1 * 60 + m1;

  while (current + slotLength <= end) {
    const sh = String(Math.floor(current / 60)).padStart(2, '0');
    const sm = String(current % 60).padStart(2, '0');
    const eh = String(Math.floor((current + slotLength) / 60)).padStart(2, '0');
    const em = String((current + slotLength) % 60).padStart(2, '0');
    slots.push({ startTime: `${sh}:${sm}`, endTime: `${eh}:${em}` });
    current += slotLength;
  }
  return slots;
}

export default function DoctorDetailPage() {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctor/profile/${userId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDoctor();
  }, [userId]);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    async function fetchBookedSlots() {
      try {
        const res = await axios.get(`http://localhost:5000/api/appointments/doctor/${userId}`, {
          params: { date: selectedDate }
        });
        setBookedSlots(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchBookedSlots();
  }, [userId, selectedDate]);

  if (!doctor) return <div className="text-center py-5">Loading doctor profile...</div>;

  const slots = generateTimeSlots(WORKING_HOURS);
  const isBooked = (slot) =>
    bookedSlots.some(b => b.startTime === slot.startTime && b.endTime === slot.endTime);

  function handleSlotClick(slot) {
    setSelectedSlot(slot);
    setShowModal(true);
  }

  async function bookAppointment() {
    if (!currentUser) {
      alert('Please login to book an appointment.');
      setShowModal(false);
      return;
    }
    setBooking(true);
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        doctor: userId,
        patient: currentUser.id || currentUser._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      alert('Appointment booked successfully!');
      setShowModal(false);
      const res = await axios.get(`http://localhost:5000/api/appointments/doctor/${userId}`, {
        params: { date: selectedDate }
      });
      setBookedSlots(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book appointment');
      console.error(err);
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="card shadow-lg mx-auto" style={{ maxWidth: '700px' }}>
        <div className="card-body text-center">
          <img
            src={doctor.profileImage ? `http://localhost:5000/uploads/${doctor.profileImage}` : 'https://i.pravatar.cc/150'}
            alt={doctor.fullName}
            className="rounded-circle mb-3 border"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
          <h2 className="card-title">{doctor.fullName}</h2>
          <p className="text-muted fst-italic">{doctor.specialization}</p>
          <p className="mt-2">{doctor.bio}</p>

          <hr />
          <h5 className="mt-3">Qualifications</h5>
          <ul className="list-group list-group-flush text-start">
            {doctor.qualifications.map((q, idx) => (
              <li className="list-group-item" key={idx}>{q}</li>
            ))}
          </ul>
          <p className="mt-3 fw-semibold">Experience: {doctor.experienceYears} years</p>

          <div className="mt-4 text-start">
            <label className="form-label fw-bold">Select Date</label>
            <input
              type="date"
              className="form-control"
              min={new Date().toISOString().slice(0, 10)}
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="mt-4 text-start">
            <h5>Available Time Slots</h5>
            {loadingSlots ? (
              <p>Loading...</p>
            ) : (
              <div className="d-flex flex-wrap gap-2 border p-3 rounded bg-light">
                {slots.map(slot => {
                  const booked = isBooked(slot);
                  return (
                    <button
                      key={slot.startTime}
                      className={`btn btn-sm ${booked ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      disabled={booked || booking}
                      onClick={() => !booked && handleSlotClick(slot)}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for confirming booking */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSlot && (
            <p>
              Book appointment with <strong>{doctor.fullName}</strong> on{' '}
              <strong>{selectedDate}</strong> from{' '}
              <strong>{selectedSlot.startTime}</strong> to{' '}
              <strong>{selectedSlot.endTime}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={bookAppointment} disabled={booking}>
            {booking ? 'Booking...' : 'Confirm'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
