import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Customer } from '@/types';

type CreateProps = {
    customerId: number;
    closeModal: () => void;
};

const Create: React.FC<CreateProps> = ({ closeModal, customerId }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const addNote = async () => {
    try {
      const response = await axios.post('/notes', {
        customer_id: customerId, // Replace this with the actual customer ID
        title,
        content,
      });
      console.log('Note added:', response.data);
      closeModal(); // Close the modal
    } catch (error) {
      console.log('Failed to add note:', error);
    }
  };

  return (
    <>
        <div className='grid grid-cols-1 gap-2'>
      <TextInput 
        type="text" 
        placeholder="Title" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
      className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      </div>
      <PrimaryButton className='mt-2' onClick={addNote}>Add Note</PrimaryButton>
    </>
  );
};

export default Create;
