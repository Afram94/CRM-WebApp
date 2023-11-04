import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Note } from '@/types';
import { successToast } from '@/Components/toastUtils';

type UpdateProps = {
  note: Note;
  closeModal: () => void;
};

const Update: React.FC<UpdateProps> = ({ closeModal, note }) => {
    const [data, setData] = useState<Partial<Note>>({
        title: note.title,
        content: note.content,
        
    });

  const updateNote = async () => {
    try {
      const response = await axios.put(`/notes/${note.id}`, data);

      // Log the updated note and close the modal
      console.log('Note updated:', response.data);
      successToast('Note successfully updated');
      closeModal();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-2'>
        <TextInput
          type="text"
          placeholder="Title"
          value={data.title}
          onChange={e => setData(prevData => ({ ...prevData, title: e.target.value }))}
        />
        <textarea
          className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
          placeholder="Content"
          value={data.content}
          onChange={e => setData(prevData => ({ ...prevData, content: e.target.value }))}
        />
      </div>
      <PrimaryButton className='mt-2' onClick={updateNote}>Update Note</PrimaryButton>
    </>
  );
};

export default Update;
