import React, { useState } from "react";
import "./Calendar.css";

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper functions
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(
      currentMonth.getMonth(),
      currentMonth.getFullYear()
    );
    const startDay = startDayOfMonth(
      currentMonth.getMonth(),
      currentMonth.getFullYear()
    );

    const daysArray = [];
    for (let i = 0; i < startDay; i++) {
      daysArray.push(<div className="calendar-cell empty" key={`empty-${i}`}></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
      const isAvailable = Math.random() > 0.5; // Random availability for demo
      daysArray.push(
        <div
          key={i}
          className={`calendar-cell day ${isAvailable ? "available" : "unavailable"}`}
        >
          <span>{i}</span>
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-cell header">MON</div>
        <div className="calendar-cell header">TUE</div>
        <div className="calendar-cell header">WED</div>
        <div className="calendar-cell header">THU</div>
        <div className="calendar-cell header">FRI</div>
        <div className="calendar-cell header">SAT</div>
        <div className="calendar-cell header">SUN</div>
        {renderCalendar()}
      </div>
    </div>
  );
}

export default Calendar;
