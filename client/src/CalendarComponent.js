import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ token }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch tasks and transform them into calendar events
    Axios.get('http://localhost:3001/getTasks/All', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        const tasks = response.data.map((task) => ({
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
        }));
        setEvents(tasks);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, [token]);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalendarComponent;
