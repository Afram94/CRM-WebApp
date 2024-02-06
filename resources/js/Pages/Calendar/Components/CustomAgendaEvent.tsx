/* // components/CustomAgendaEvent.tsx
import React from 'react';
import { Event as CalendarEvent } from 'react-big-calendar';
import { CalendarEvent as MyCalendarEvent } from '@/types'; // Adjust this path as necessary

interface CustomAgendaEventProps {
  event: CalendarEvent & MyCalendarEvent;
}

const CustomAgendaEvent: React.FC<CustomAgendaEventProps> = ({ event }) => {
  // Function to format date to local time string
  const formatTime = (date: Date | string) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <tr className="bg-white">
      <td className="p-2 border-b border-gray-200">{event.title}</td>
      <td className="p-2 border-b border-gray-200">{formatTime(event.start)}</td>
      <td className="p-2 border-b border-gray-200">{formatTime(event.end)}</td>
      <td className="p-2 border-b border-gray-200">
        <button className="text-blue-600 hover:text-blue-800">Edit</button>
      </td>
    </tr>
  );
};

export default CustomAgendaEvent;
 */