import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';

const CustomerNotes: React.FC<PageProps> = ({ auth }) => {
    const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

    const toggleNote = (noteId: number) => {
        setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
    };
  return (
    <MainLayout>
        {auth && auth.customer_notes.length > 0 ? (
      <div className="flex flex-wrap justify-around">
        {auth.customer_notes.map((note) => (
          <div key={note.id} className="m-4 relative">
            <div
              className=" h-auto p-5 rounded-lg shadow-lg border border-yellow-300 cursor-pointer"
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
            <div className="absolute top-0 right-0 mt-2 mr-2 group">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {note.user_name.charAt(0).toUpperCase()}
              </div>
              <div
                className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white rounded px-2 py-1 text-xs"
                style={{ transition: 'opacity 0.2s' }}
              >
                {note.user_name}
              </div>
            </div>
          </div>
        ))}
      </div>
      ) : (
            <div className='flex flex-col justify-center items-center h-full text-[30px] font-semibold'>    
                <p className=''>This customer does not have any note...</p>
            </div> 
      )}
    </MainLayout>
  );
};

export default CustomerNotes;
