import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types'; // Adjust the import path based on where your interface is defined
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';

interface EditEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onSave: (updatedEvent: CalendarEvent) => void;
  showModal: boolean;
}

function EditEventModal({ event, onClose, onSave, showModal }: EditEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setColor(event.color || '#3174ad');
    }
  }, [event]);

  const handleSave = () => {
    const updatedEvent = { ...event, title, description, color };
    onSave(updatedEvent);
    onClose();
  };

  return (
    <Modal show={showModal} onClose={onClose} maxWidth="md">
        <div className='overflow-auto p-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
            {/* Event Information Section */}
            <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 flex justify-center pt-2">Event Information</h3>
                <table className="min-w-full table-auto">
                    <tbody>
                    <tr className="bg-white dark:bg-gray-700 border-b dark:border-gray-600">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">Title</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{event.title}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-700 border-b dark:border-gray-600">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">Description</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{event.description || 'No description'}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">Color</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: event.color, borderRadius: '50%' }}></span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>


            {/* Event Update Section */}
            <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 flex justify-center border-t pt-3">Update Event</h3>
            <InputLabel className='text-gray-600 dark:text-gray-300' value='Title'></InputLabel>
            <TextInput
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Title"
                className="input input-bordered w-full mb-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            />
                <InputLabel className='text-gray-600 dark:text-gray-300' value='Description'></InputLabel>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event Description"
                className='border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 rounded-md shadow-sm w-full dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-indigo-500'
            />
            <TextInput
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="input input-bordered w-full mb-2 dark:border-gray-600"
            />
            </div>

            <div className="flex justify-end space-x-2">
            <PrimaryButton className="btn btn-primary dark:bg-indigo-600 dark:hover:bg-indigo-700" onClick={handleSave}>Save</PrimaryButton>
            <PrimaryButton className="btn dark:bg-gray-600 dark:hover:bg-gray-700" onClick={onClose}>Close</PrimaryButton>
            </div>
        </div>
        </Modal>

  );
}

export default EditEventModal;
