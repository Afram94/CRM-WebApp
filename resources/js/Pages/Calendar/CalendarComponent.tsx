// CalendarComponent.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from '@/Components/Modal'; // Adjust this path as necessary
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout'; // Adjust this path as necessary
import { CalendarEvent, PageProps } from '@/types'; // Adjust this path as necessary

const localizer = momentLocalizer(moment);

const CalendarComponent: React.FC<PageProps> = ({ auth }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    const fetchedEvents = auth.calendar.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  
    setEvents(prevEvents => {
      // Check for duplicates before adding to the state
      const newEvents = fetchedEvents.filter(fetchedEvent => 
        !prevEvents.some(event => event.id === fetchedEvent.id)
      );
      return [...prevEvents, ...newEvents];
    });
  }, [auth.calendar]);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setModalShow(true);
    setTitle('');
    setDescription('');
    setEnd('');
  };

  const closeModal = () => {
    setModalShow(false);
    setSelectedDate(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedStart = selectedDate ? moment(selectedDate).format('YYYY-MM-DD HH:mm:ss') : '';
    const formattedEnd = end ? moment(end).format('YYYY-MM-DD HH:mm:ss') : '';

    if (!formattedStart || !formattedEnd) {
      console.error('Start or end date is missing.');
      return;
    }

    try {
      const eventData = {
        title,
        description,
        start: formattedStart,
        end: formattedEnd,
      };
      
      const response = await axios.post('/events', eventData);
      const newEvent = { ...response.data, start: new Date(response.data.start), end: new Date(response.data.end) };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      closeModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eventStyleGetter = (event: CalendarEvent, start: Date, end: Date, isSelected: boolean) => {
    const style = {
      backgroundColor: '#3174ad', // Example background color
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
  
    return {
      style: style
    };
  }

  return (
    <>
      <MainLayout title="Calendar">
        <div className="bg-gray-100 h-screen p-12">
          <Calendar
            localizer={localizer}
            events={events}
            selectable
            onSelectSlot={handleSelectSlot}
            style={{ height: 500 }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </MainLayout>
      <Modal show={modalShow} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-class-names" // Replace with your TailwindCSS class names
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea-class-names" // Replace with your TailwindCSS class names
          />
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="input-class-names" // Replace with your TailwindCSS class names
          />
          <button type="submit" className="button-class-names">Save Event</button> // Replace with your TailwindCSS class names
        </form>
      </Modal>
    </>
  );
};

export default CalendarComponent;
