import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./appointment.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoArrowBack } from 'react-icons/io5';import Footer from './FooterSection';
import NavbarUser from './NavbarUser';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Appointments() {
  const location = useLocation();
  const { technician, service } = location.state || {};
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsData, setSlotsData] = useState({});
  const [userProfile, setUserProfile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "", 
    address: "", 
    services: [service?.name], 
    technicianName: technician?.name, 
    description: "",
    damagePartFile: undefined,
    appointmentDetails: "", 
    priority: "Medium", 
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch user profile using userId and token
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId && token) {
      axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setUserProfile(response.data);
        setFormData(prev => ({
          ...prev,
          fullName: response.data.name,
          email: response.data.email,
          phoneNumber: response.data.phone || "",
          address: response.data.address || "",
        }));
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to fetch user profile.');
      });
    } else {
      toast.error('User is not authenticated.');
    }
  }, []);

  useEffect(() => {
    fetchMonthSlots();
  }, [currentMonth, currentYear, technician?._id]);

  const fetchMonthSlots = () => {
    axios.post('http://localhost:5000/api/availability/total-slots', {
      technicianId: technician._id,
      month: currentMonth,
      year: currentYear
    })
    .then(response => {
      const slotsData = response.data.totalSlotsPerDate;

      if (slotsData && slotsData.length > 0) {
        setSlotsData(prevData => {
          const newData = { ...prevData };
          slotsData.forEach(item => {
            newData[item.date] = item.totalSlots;
          });
          return newData;
        });
      } else {
        setSlotsData({});
        toast.error('No availability data found.');
      }
    })
    .catch(error => {
      console.error('Error fetching slots:', error);
      setSlotsData({});
      toast.error('Failed to fetch availability data.');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  const isPastDate = (year, month, day) => {
    const checkDate = new Date(year, month - 1, day);
    checkDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return checkDate < todayDate;
  };

  const handlePreviousMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleDateClick = (day) => {
    if (isPastDate(currentYear, currentMonth, day)) return;
    setSelectedDate(day);
    setLoading(true);

    setTimeout(() => {
      const date = `${day}-${currentMonth}-${currentYear}`;
      axios.post('http://localhost:5000/api/availability/get-slots', {
        technicianId: technician._id,
        date
      })
      .then(response => {
        const availableSlots = response.data.slots || [];
        if (availableSlots.length > 0) {
          setAvailableSlots(availableSlots);
        } else {
          setAvailableSlots([]);
          toast.error('No slots available for this date.');
        }
      })
      .catch(error => {
        console.error('Error fetching available slots:', error);
        setAvailableSlots([]);
        toast.error('Failed to fetch available slots.');
      })
      .finally(() => {
        setLoading(false);
      });
    }, 2000);
  };

  const handleBookAppointmentClick = (time) => {
    const userId = localStorage.getItem("userId");

    // Step 1: Check if the user has already booked the service
    axios.get(`http://localhost:5000/api/appointments/check-booking?userId=${userId}&serviceId=${service._id}`)
      .then((response) => {
        // If the user has already booked the appointment for the same service, show alert and don't open the form
        if (response.data.message === "You have already booked an appointment for this service.") {
          alert("You cannot book multiple slots for the same service. You already have a booking for this service.");
          return; // Stop further processing and prevent the modal from opening
        } else {
          // Step 2: If no existing booking, check if the selected time slot is available
          axios.get(`http://localhost:5000/api/appointments/check-slot-availability?userId=${userId}&serviceId=${service._id}&time=${time}&date=${selectedDate}`)
            .then((response) => {
              // If the selected slot is already booked, show an alert and prevent the modal from opening
              if (response.data.message === "This slot is already booked. Please choose another slot.") {
                alert("This slot is already booked. Please choose another slot.");
                return; // Prevent opening the form/modal
              } else {
                // Slot is available, show the form
                setSelectedTime(time);
                setFormData(prev => ({
                  ...prev,
                  appointmentDetails: `Appointment on ${selectedDate}-${currentMonth}-${currentYear} at ${time}`,
                }));
                setModalVisible(true);  // Open the form/modal only if the slot is available
              }
            })
            .catch((error) => {
              console.error("Error checking slot availability:", error);
              toast.error("Failed to check slot availability.");
            });
        }
      })
      .catch((error) => {
        console.error("Error checking booking:", error);
        toast.error("Failed to check booking.");
      });
};



  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        damagePartFile: files[0], 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Form Validation
    if (!formData.description) {
      alert("Description is required.");
      return;
    }
  
    if (!formData.damagePartFile) {
      alert("Damage part image is required.");
      return;
    }
  
    const formDataToSend = new FormData();
  
    formDataToSend.append("userId", localStorage.getItem('userId'));
    formDataToSend.append("technicianId", technician._id);
    formDataToSend.append("serviceId", service._id);
    formDataToSend.append("appointmentDetails", formData.appointmentDetails);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("damagePartFile", formData.damagePartFile);
  
    // Send POST request to backend for appointment booking
    axios.post('http://localhost:5000/api/appointments/book', formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
      console.log(response); // Optional: Check response for troubleshooting
      if (response.status === 201) { // Ensure successful status
        // Reset the form after successful submission
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          address: "",
          services: [],
          description: "",
          damagePartFile: null,
          appointmentDetails: "",
          priority: "Medium",
        });
  
        // Close the modal immediately after the form is successfully submitted
        setModalVisible(false);
  
        // Show the alert after closing the modal
        setTimeout(() => {
          alert("Appointment booked successfully!");
        }, 100); // Small delay to ensure modal closes first
      } else {
        alert('Failed to book appointment. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    });
  };
  
  

  return (
    <>
     <div className="image-section position-relative">
        <div className="image-overlay">
          <div className="text-content text-center">
            <h1 className="image-title">Schedule an Appointment</h1>
            <p className="image-subtitle">Book Appointment for {technician?.name} - {service?.name}</p>
          </div>

          {/* Back Arrow Button with React Icons */}
          <a href="HeroAfterLogin" className="position-absolute top-0 start-0 m-3 text-white fs-4">
            <IoArrowBack /> {/* React Icon Back Arrow */}
          </a>
        </div>
      </div>


      <div className="calendar-container container">
        <div className="calendar-header d-flex justify-content-between align-items-center">
          <button className="arrow-btn" onClick={handlePreviousMonth}> &#8592; </button>
          <div className="fw-bold fs-5 text-center flex-grow-1">
            {`${new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} ${currentYear}`}
          </div>
          <button className="arrow-btn" onClick={handleNextMonth}> &#8594; </button>
        </div>

        <div className="days-of-week d-flex text-center fw-bold">
          {daysOfWeek.map((day, index) => (
            <div className="flex-fill py-2" key={index}>{day}</div>
          ))}
        </div>

        <div className="calendar-days d-flex flex-wrap">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const isAvailable = !isPastDate(currentYear, currentMonth, day);
            const slotInfo = slotsData[`${day}-${currentMonth}-${currentYear}`] || 0;

            return (
              <div
                key={day}
                className={`day-cell ${isAvailable ? "available" : "unavailable"} p-2 border position-relative`}
                onMouseEnter={() => slotInfo && toast.info(`${slotInfo} slots available`)}
                onClick={() => isAvailable && handleDateClick(day)}
              >
                <span className="day-number">{day}</span>
                {slotInfo > 0 && (
                  <div className="slot-tooltip" style={{ display: 'block' }}>
                    {slotInfo} slots available
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && selectedDate && (
          <div className="appointments mt-4">
            <h3 className="fs-5 text-center">
              Available Slots for {technician?.name} on{" "}
              {`${new Date(currentYear, currentMonth - 1, selectedDate).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`}
            </h3>
            <div className="list-group">
              {availableSlots.length === 0 ? (
                <div className="list-group-item">No available slots for this date.</div>
              ) : (
                availableSlots.map((time, index) => (
                  <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{time}</span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleBookAppointmentClick(time)}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {modalVisible && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request an Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  {/* Form Fields */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Appointment Details</label>
                    <input type="text" className="form-control bg-light" value={formData.appointmentDetails} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Service Name</label>
                    <input type="text" className="form-control bg-light" value={formData.services.join(", ")} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Technician Name</label>
                    <input type="text" className="form-control bg-light" value={formData.technicianName} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Your Name</label>
                    <input type="text" className="form-control" name="fullName" value={formData.fullName} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Your Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Your Phone Number</label>
                    <input type="text" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Your Address</label>
                    <textarea className="form-control" name="address" rows="3" value={formData.address} onChange={handleFormChange}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Damage Part Image (Required)</label>
                    <input type="file" className="form-control" name="damagePartFile" accept="image/*" onChange={handleFormChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Priority</label>
                    <select className="form-control" name="priority" value={formData.priority} onChange={handleFormChange}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea className="form-control" name="description" rows="4" value={formData.description} onChange={handleFormChange} required></textarea>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Appointments;
