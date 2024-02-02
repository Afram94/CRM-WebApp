// CalendarComponent.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
/* import moment from 'moment'; */
import Modal from '@/Components/Modal'; // Adjust this path as necessary
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import MainLayout from '@/Layouts/MainLayout'; // Adjust this path as necessary
import { CalendarEvent, PageProps } from '@/types'; // Adjust this path as necessary
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';

import EditEventModal from '@/Pages/Calendar/EditEventModal'

import moment from 'moment-timezone';

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'; // Import this

// Import styles specifically for drag and drop
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import './CustomCalendarStyles.css'; // Adjust the path to where your CSS file is located


const DnDCalendar = withDragAndDrop(Calendar);

const localizer = momentLocalizer(moment);

const CalendarComponent: React.FC<PageProps> = ({ auth }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [end, setEnd] = useState('');

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [editModalShow, setEditModalShow] = useState(false);

  const [view, setView] = useState<any>(localStorage.getItem('calendarView') || 'month');

  const [color, setColor] = useState<string>('#3174ad'); // Default color


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
    const fetchedEvents = auth.calendar.map(event => {
        // Adjust these lines to convert UTC times from the database to local times
        const start = moment.utc(event.start).local().toDate();
        const end = moment.utc(event.end).local().toDate();
  
        return {
          ...event,
          start,
          end,
        };
      });
  
    setEvents(prevEvents => {
      // Check for duplicates before adding to the state
      const newEvents = fetchedEvents.filter(fetchedEvent => 
        !prevEvents.some(event => event.id === fetchedEvent.id)
      );
      return [...prevEvents, ...newEvents];
    });
  }, [auth.calendar]);

  const handleSelectSlot = (slotInfo: { start: Date, end: Date }) => {
    const now = new Date();
  
    // Check if the selected slot's start time is before the current time
    if (slotInfo.start.getTime() < now.getTime()) {
      // Optionally, you can alert the user or handle this case differently
      alert("Cannot create an event in the past.");
      return; // Do not proceed to show the modal or set state
    }
  
    // If the time is not in the past, proceed as normal
    setSelectedDate(slotInfo.start);

    // Ensure the end date is the same day as the start date
    // Here we're setting the end time to the end of the day
    const endOfDay = moment(slotInfo.start).endOf('day');
    // Format the end date to include the end of the selected day
    setEnd(endOfDay.format('YYYY-MM-DDTHH:mm'));
    
    /* setEnd(moment(slotInfo.end).format('YYYY-MM-DDTHH:mm')); */
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
    
        // Use the time zone for Sweden
        const timeZone = 'Europe/Stockholm';
        const formattedStart = selectedDate ? moment(selectedDate).tz(timeZone).format('YYYY-MM-DD HH:mm:ss') : '';
        const formattedEnd = end ? moment(end).tz(timeZone).format('YYYY-MM-DD HH:mm:ss') : '';
    
        console.log('Selected start (local):', selectedDate);
        console.log('Selected end (local):', end);
        console.log('Formatted start (timezone):', formattedStart);
        console.log('Formatted end (timezone):', formattedEnd);


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
            color,
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


  /* Modal Update Event */

  const updateEvent = async (updatedEvent: CalendarEvent) => {
    // Update the event in the local state
    const newEvents = events.map(event =>
        event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
    );
    setEvents(newEvents);

    // Optionally, send the update to the server
    try {
        const response = await axios.put(`/events/${updatedEvent.id}`, updatedEvent);
        console.log("Event updated:", response.data);
        // Optionally, refresh the events from the server here if needed
    } catch (error) {
        console.error("Error updating event:", error);
    }

    setEditModalShow(false); // Close the edit modal
    };

    /* This is to the modal, return in in the calendar */
    const handleSelectEvent = (event:any) => {
        setSelectedEvent(event);
        setEditModalShow(true); // Open the modal
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
        const now = new Date();
        const { event, start, end } = args;
    
        // Check if the new start or end time is in the past
        if (start < now || end < now) {
            alert("Cannot move an event to the past.");
            return; // Exit the function without updating the event
        }
    
        // If the time is valid, proceed with the event update
        handleEventUpdate({ ...event, start: new Date(start), end: new Date(end) } as CalendarEvent);
    };
    
    const handleEventResize = (args: any) => {
        const now = new Date();
        const { event, start, end } = args;
    
        // Check if the new start or end time is in the past
        if (start < now || end < now) {
            alert("Cannot resize an event to the past.");
            return; // Exit the function without updating the event
        }
    
        // If the time is valid, proceed with the event update
        handleEventUpdate({ ...event, start: new Date(start), end: new Date(end) } as CalendarEvent);
    };


        // Define the minimum and maximum hours for the calendar's day view
        const minTime = new Date();
        minTime.setHours(6, 0, 0); // Day starts at 6:00 AM

        const maxTime = new Date();
        maxTime.setHours(23, 59, 59); // Day ends just before midnight


        const formats = {
            timeGutterFormat: (date:any, culture:any, localizer:any) => 
              localizer.format(date, 'h:mm A', culture),
            // You can define other format options here
          };
      


    const eventStyleGetter = (event: any, start: Date, end: Date, isSelected: boolean) => {
        const style = {
          backgroundColor: event.color || '#3174ad', // Use the event's color or a default
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

            min={minTime} // Set minimum time
            max={maxTime} // Set maximum time

            step={10} // Set the step to 10 minutes
            timeslots={6} // Since there are 6 slots in an hour if we divide it by 10 minutes

            onSelectEvent={handleSelectEvent}

            formats={formats}
          />

          {/* TODO: Fix the design to the modal */}
        {editModalShow && selectedEvent && (
            <EditEventModal 
                event={selectedEvent}
                onClose={() => setEditModalShow(false)}
                onSave={updateEvent} // Pass the updateEvent function directly
            />
        )}
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

            <div>
                <InputLabel htmlFor="color" value="Event Color" />
                <TextInput
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
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
