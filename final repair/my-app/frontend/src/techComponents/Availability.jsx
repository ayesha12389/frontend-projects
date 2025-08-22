import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TechOverview.css";
import logo from "../assets/logo1.png";
import TopbarTech from "./TopbarTech";
import { NavLink } from "react-router-dom";

function Availibility() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [searchText, setSearchText] = useState("");
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const technicianId = localStorage.getItem("userId");

  const generateDays = () => Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isPastDate = (day) => {
    const today = new Date();
    const currentDay = new Date(currentYear, currentMonth - 1, day);
    return currentDay < today;
  };

  const handleSearch = (query) => {
    setSearchText(query.trim().toLowerCase());
  };

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/availability/${technicianId}`);
        const availability = response.data.availability || [];

        const initialDates = [];
        const initialSlots = {};

        availability.forEach((entry) => {
          initialDates.push(entry.date);
          initialSlots[entry.date] = entry.slots;
        });

        setSelectedDates(initialDates);
        setSelectedSlots(initialSlots);
      } catch (err) {
        console.error("Error fetching availability on load", err);
      }
    };

    fetchAvailability();
  }, [technicianId]);

  const handleDateClick = async (day) => {
    if (isPastDate(day)) return;

    const fullDate = `${day}-${currentMonth}-${currentYear}`;
    if (selectedDates.includes(fullDate)) {
      setSelectedDates(selectedDates.filter((d) => d !== fullDate));
      setSelectedSlots((prev) => {
        const updated = { ...prev };
        delete updated[fullDate];
        return updated;
      });
    } else {
      setSelectedDates([...selectedDates, fullDate]);

      try {
        const response = await axios.get(`http://localhost:5000/api/availability/${technicianId}`);
        const availability = response.data.availability || [];
        const match = availability.find((entry) => entry.date === fullDate);
        if (match) {
          setSelectedSlots((prev) => ({ ...prev, [fullDate]: match.slots }));
        } else {
          setSelectedSlots((prev) => ({ ...prev, [fullDate]: [] }));
        }
      } catch (err) {
        console.error("Error fetching availability", err);
      }
    }
  };

  const handleSlotSelection = async (date, slot) => {
    const isSelected = selectedSlots[date]?.includes(slot);

    if (isSelected) {
      const updatedSlots = selectedSlots[date].filter((s) => s !== slot);
      setSelectedSlots((prev) => ({ ...prev, [date]: updatedSlots }));
      await axios.post("http://localhost:5000/api/availability/remove-slot", { technicianId, date, slot });
    } else {
      const updatedSlots = [...(selectedSlots[date] || []), slot];
      setSelectedSlots((prev) => ({ ...prev, [date]: updatedSlots }));
      await axios.post("http://localhost:5000/api/availability/add-slot", { technicianId, date, slot });
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 12 ? 1 : prev + 1));
    if (currentMonth === 12) setCurrentYear((prev) => prev + 1);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev === 1 ? 12 : prev - 1));
    if (currentMonth === 1) setCurrentYear((prev) => prev - 1);
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
            <NavLink to="/technician" className="text-decoration-none text-white">Dashboard</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/workload" className="text-decoration-none text-white">Manage Workload</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/update" className="text-decoration-none text-white">Update Job Status</NavLink>
          </li>
          <li className="menu-item active">
            <NavLink to="/availability" className="text-decoration-none text-white">Set Availability</NavLink>
          </li>
          <li className="menu-item">
            <NavLink to="/report" className="text-decoration-none text-white">Upload Services Report</NavLink>
          </li>
          {/* <li className="menu-item">
            <NavLink to="/communicate" className="text-decoration-none text-white">Communicate with Customer</NavLink>
          </li> */}
        </ul>
      </div>

      <div className="main-content">
        <TopbarTech onSearch={handleSearch} />
        <div className="row mt-4">
          <div className="col-md-7">
            <div className="card p-3 shadow-sm">
              <h5 className="mb-3">Set Availability</h5>
              <div className="calendar-header d-flex justify-content-between">
                <button className="btn btn-outline-secondary" onClick={handlePreviousMonth}>&lt;</button>
                <h6>{new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} {currentYear}</h6>
                <button className="btn btn-outline-secondary" onClick={handleNextMonth}>&gt;</button>
              </div>
              <div className="days-of-week d-flex justify-content-between fw-bold mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center flex-fill">{day}</div>
                ))}
              </div>
              <div className="calendar-days d-flex flex-wrap">
                {generateDays().map((day) => {
                  const fullDate = `${day}-${currentMonth}-${currentYear}`;
                  const isSelected = selectedDates.includes(fullDate);
                  return (
                    <div
                      key={day}
                      className={`day-cell text-center ${isSelected ? "bg-warning text-white" : "bg-light"} p-2 m-1`}
                      style={{ width: "13%", cursor: isPastDate(day) ? "not-allowed" : "pointer", borderRadius: "8px" }}
                      onClick={() => !isPastDate(day) && handleDateClick(day)}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card p-3 shadow-sm">
              <h5 className="mb-3">Available Slots</h5>
              {selectedDates
                .filter((date) => date.toLowerCase().includes(searchText))
                .map((date) => (
                  <div key={date} className="mb-3">
                    <h6>Date: {date}</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {["9:00 AM-11:00 AM", "11:00 AM-1:00 PM", "1:00 PM-3:00 PM", "3:00 PM-5:00 PM"].map((slot) => (
                        <button
                          key={slot}
                          className={`btn btn-sm ${selectedSlots[date]?.includes(slot) ? "btn-warning text-white" : "btn-outline-secondary"}`}
                          onClick={() => handleSlotSelection(date, slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Availibility;
