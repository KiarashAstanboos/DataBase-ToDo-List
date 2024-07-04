// src/CalendarComponent.js
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarComponent.css'; // Add this line for custom styles

const CalendarComponent = ({ tasks }) => {
  const tileClassName = ({ date }) => {
    const taskDates = tasks.map(task => new Date(task.dueDate).setHours(0, 0, 0, 0));
    const currentDate = date.setHours(0, 0, 0, 0);
    return taskDates.includes(currentDate) ? 'react-calendar__tile--active' : '';
  };

  const tileContent = ({ date }) => {
    const taskDates = tasks.map(task => new Date(task.dueDate).setHours(0, 0, 0, 0));
    const currentDate = date.setHours(0, 0, 0, 0);
    return taskDates.includes(currentDate) ? '•' : null;
  };

  return (
    <div className="calendar-container">
      <Calendar
        tileClassName={tileClassName}
        tileContent={tileContent}
      />
    </div>
  );
};

export default CalendarComponent;
