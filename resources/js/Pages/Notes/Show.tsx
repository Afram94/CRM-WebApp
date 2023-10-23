import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Show: React.FC<PageProps> = ({ auth }) => {
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(auth.notes); // State for filtered notes

  const toggleNote = (noteId: number) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };


  useEffect(() => {
    if (searchTerm === '') {
        setFilteredNotes(auth.notes);
        return;
    }

    if (searchTerm.length >= 3) {
        const fetchFilteredNotes = async () => {
            try {
                const response = await axios.get(`/notes?search=${searchTerm}`);
                if (response.data && response.data.auth && response.data.auth.notes) {
                    setFilteredNotes(response.data.auth.notes);
                }
            } catch (error) {
                console.error('Failed to fetch filtered notes:', error);
            }
        };

        fetchFilteredNotes();
    } else {
        setFilteredNotes(auth.notes);
    }
  }, [searchTerm, auth.notes]);

  const handleReset = () => {
    setSearchTerm('');
  }

  return (
    <MainLayout>
        <div className="m-5 flex justify-end gap-2">
          <TextInput
              type="text"
              placeholder="Search note..."
              className='h-9'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
          />
          <DangerButton onClick={handleReset}>Reset</DangerButton>
      </div>
      <div className="flex flex-wrap ">
        {filteredNotes.map((note) => (
          <div key={note.id} className="m-4 relative">
            <div
              className="w-fit h-auto p-5 rounded-lg shadow-lg border border-yellow-300 cursor-pointer"
              style={{
                background: 'linear-gradient(45deg, #FEF3C7, #FEE2B3)',
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)'
              }}
              onClick={() => toggleNote(note.id)}
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                {note.title}
              </h3>
              <div 
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: expandedNoteId === note.id ? '500px' : '0',
                  transition: 'max-height 1s ease-in-out'
                }}
              >
                <p className="text-base mb-3 text-gray-800">{note.content}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Customer Name:</p>
                <p className="text-sm text-gray-600 border-b border-gray-600">
                  {note.customer_name}
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 mt-2 mr-2 group select-none">
              <div className="w-6 h-6 bg-blue-500 text-white text-[17px] rounded-full flex items-center justify-center">
                {note.user_name.charAt(0).toUpperCase()}
              </div>
              <div
                className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white rounded px-2 py-1 text-xs select-none"
                style={{ transition: 'opacity 0.2s' }}
              >
                {note.user_name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Show;
