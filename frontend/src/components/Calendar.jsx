import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ registrations = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const days = [];
  // Fill empty slots for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Fill actual days
  for (let d = 1; d <= numDays; d++) {
    const dateStr = new Date(year, month, d).toDateString();
    const dayEvents = registrations.filter(reg => 
      reg.event && new Date(reg.event.eventDate).toDateString() === dateStr && reg.status === 'accepted'
    );

    const isToday = new Date().toDateString() === dateStr;
    const hasEvent = dayEvents.length > 0;

    days.push(
      <div 
        key={d} 
        className={`calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
      >
        {d}
        {hasEvent && (
          <div className="event-tooltip">
            {dayEvents.map((reg, idx) => (
              <div key={idx} className="tooltip-item">
                <div className="tooltip-title">{reg.event.title}</div>
                <div className="tooltip-meta">📍 {reg.event.location}</div>
                <div className="tooltip-meta">🕐 {new Date(reg.event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3>{monthName} {year}</h3>
        <div className="calendar-nav">
          <button onClick={prevMonth}>&lt;</button>
          <button onClick={nextMonth}>&gt;</button>
        </div>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default Calendar;
