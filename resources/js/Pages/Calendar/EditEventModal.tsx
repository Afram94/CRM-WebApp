import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types'; // Adjust the import path based on where your interface is defined

interface EditEventModalProps {
    event: CalendarEvent;
    onClose: () => void;
    onSave: (updatedEvent: CalendarEvent) => void;
  }
  
  function EditEventModal({ event, onClose, onSave }: EditEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    console.log("Event received in modal:", event);
    // Populate the modal with the event details when the modal opens
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setColor(event.color || '#3174ad');
    }
  }, [event]);

  const handleSave = () => {
    // Create an updated event object
    const updatedEvent = {
      ...event,
      title,
      description,
      color,
    };
    onSave(updatedEvent); // Call the onSave method passed from the parent component
  };

  return (
    <div className="edit-event-modal">
      {/* The modal content */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Event Description"
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default EditEventModal;
