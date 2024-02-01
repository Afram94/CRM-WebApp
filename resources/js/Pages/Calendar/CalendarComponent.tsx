// CalendarComponent.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from '@/Components/Modal'; // Adjust this path as necessary
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout'; // Adjust this path as necessary
import { CalendarEvent, PageProps } from '@/types'; // Adjust this path as necessary
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'; // Import this

// Import styles specifically for drag and drop
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DnDCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

const CalendarComponent: React.FC<PageProps> = ({ auth }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [end, setEnd] = useState('');

  const [view, setView] = useState<any>(localStorage.getItem('calendarView') || 'month');

  // Function to handle view changes and save the current view to local storage
  const handleViewChange = (nextView: string) => {
    localStorage.setItem('calendarView', nextView);
    setView(nextView);
  };

  const [date, setDate] = useState(new Date(localStorage.getItem('calendarDate') || Date.now()));

  // Function to handle date navigation and save the current date to local storage
  const handleNavigate = (newDate: Date) => {
    localStorage.setItem('calendarDate', newDate.toISOString());
    setDate(newDate);
  };

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

  const handleSelectSlot = (slotInfo: { start: Date, end: Date }) => {
    setSelectedDate(slotInfo.start);
    setEnd(moment(slotInfo.end).format('YYYY-MM-DDTHH:mm')); // Use the actual end time from slotInfo
    setModalShow(true);
    setTitle('');
    setDescription('');
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
            start: new Date(formattedStart),
            end: new Date(formattedEnd),
          };
      
      const response = await axios.post('/events', eventData);
      const newEvent = { ...response.data, start: new Date(response.data.start), end: new Date(response.data.end) };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      closeModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateEventInState = (updatedEvent: CalendarEvent) => {
    setEvents(prevEvents => prevEvents.map(event => event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event));
  };
  
  

  const handleEventUpdate = async (eventToUpdate: CalendarEvent) => {
    // Ensure start and end are properly formatted as Date objects
    try {
            const response = await axios.put(`/events/${eventToUpdate.id}`, {
                ...eventToUpdate,
                start: moment(eventToUpdate.start).format('YYYY-MM-DD HH:mm:ss'),
                end: moment(eventToUpdate.end).format('YYYY-MM-DD HH:mm:ss'),
            });
            const updatedEvent = { ...response.data, start: new Date(response.data.start), end: new Date(response.data.end) };
            updateEventInState(updatedEvent);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleEventDrop = (args: any) => {
        console.log(args);
        const { event, start, end } = args;
        handleEventUpdate({ ...event, start: new Date(start), end: new Date(end) } as CalendarEvent);
      };
      
      const handleEventResize = (args: any) => {
        console.log(args);
        const { event, start, end } = args;
        handleEventUpdate({ ...event, start: new Date(start), end: new Date(end) } as CalendarEvent);
      };
      


      const eventStyleGetter = (event: any, start: Date, end: Date, isSelected: boolean) => {
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
          <DnDCalendar
            localizer={localizer}
            events={events}
            selectable
            onSelectSlot={handleSelectSlot}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            resizable
            style={{ height: 1000 }}
            eventPropGetter={eventStyleGetter}

            view={view}
            onView={handleViewChange}

            date={date}
            onNavigate={handleNavigate}
          />
        </div>
      </MainLayout>
      <Modal show={modalShow} onClose={closeModal}>
        <form className='p-5 grid grid-cols-2 gap-2' onSubmit={handleSubmit}>
            <TextInput
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-class-names" // Replace with your TailwindCSS class names
            />
            <TextInput
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea-class-names" // Replace with your TailwindCSS class names
            />
            <div>
                <InputLabel htmlFor="date" value="Start date"/>
                <TextInput
                type="datetime-local"
                placeholder="Start Date and Time"
                value={selectedDate ? moment(selectedDate).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                className="input-class-names" // Replace with your TailwindCSS class names
                />
            </div>
            <div>
                <InputLabel htmlFor="date" value="End date"/>
                <TextInput
                type="datetime-local"
                placeholder="End Date and Time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="input-class-names" // Replace with your TailwindCSS class names
                />

            </div>
            <div className='flex col-span-2 justify-end'>
                <PrimaryButton type="submit" className="button-class-names">Save Event</PrimaryButton>
            </div>
        </form>
        </Modal>
    </>
  );
};

export default CalendarComponent;
