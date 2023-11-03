import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import MainLayout from '@/Layouts/MainLayout';
import { Note, PageProps, User } from '@/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useEcho } from '../../../providers/WebSocketContext';
import EditModal from './Components/EditModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaTrashRestore } from 'react-icons/fa';
import { Inertia } from '@inertiajs/inertia';

interface Notification {
  id: string;
  type: string;
  data: any; // or a more specific type if you know it
  // ... any other fields
}

interface NewNoteEventPayload {
  note: Note;
}

interface NewNotificationEventPayload {
  notification: Notification;
}

const Show: React.FC<PageProps> = ({ auth }) => {
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(auth.notes);
  const [notifications, setNotifications] = useState<any[]>([]); // Replace any with your Notification type

  const toggleNote = (noteId: number) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleDelete = async (noteId: number) => {
    /* if(window.confirm('Are you sure you want to delete this customer?')) { */
      try {
        await axios.delete(`/notes/${noteId}`);
        /* successToast('The Customer has been deleted'); */
        /* setTimeout(() => {
            Inertia.reload({only: ['Show']}); // Delayed reload
        }, 1300); */ // Delay for 2 seconds. Adjust as needed
        // Any other post-delete operations, e.g. refreshing a list
      } catch (error) {
        
        console.error('There was an error deleting the customer:', error);
      }
    /* } */
    // .data (beacuse the pagination i use in the backedn)
  }


  useEffect(() => {
    // Search logic
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
  
  }, [searchTerm, auth.notes])
  
  const handleReset = () => {
    setSearchTerm('');
  }



  

  const user = auth.user;
  const userId = user?.id ?? null;
  const parentId = user?.user_id ?? null;

  /* console.log(user); */
  console.log(auth);

  const echo = useEcho(); // <-- Correct place to call useWebSocket
  useEffect(() => {
    // Existing logic for notes
    const handleNewNote = (newNote: Note) => {
      console.log("handleNewNote Work!!")
      setFilteredNotes((prevNotes) => {
        if (newNote.id) {  // Ensure the new note has a user name
          return [...prevNotes, newNote];
        } else {
          // Handle this case, e.g., provide a default name or fetch additional data
          console.error('New note does not have a user_name:', newNote);
          return prevNotes;  // For now, keep the old notes as they were
        }
      });
    };

    // New logic for notifications
    const handleNewNotification = (newNotification: any) => { // Replace any with your Notification type
      /* console.log("handleNewNotification Work!!") */
      setNotifications((prevNotifications) => {
        if (newNotification.id) { // Replace with a field that is required for your notification to be valid
          return [...prevNotifications, newNotification];
        } else {
          // Handle this case, e.g., log an error message or fetch additional data
          console.error('Received incomplete notification:', newNotification);
          return prevNotifications;  // For now, keep the old notifications as they were
        }
      });
    };

    if (echo && userId) {
      console.log("userChannel");
      const userChannel = echo.private(`notes-for-user-${userId}`)
        .listen('NoteCreated', (e: NewNoteEventPayload) => {
          if (e.note) {
            handleNewNote(e.note);
          } else {
            console.error('Received incomplete note:', e.note);
          }
        });
  
      let parentChannel: any;
      if (parentId !== null) {
        console.log("parentChannel");
        parentChannel = echo.private(`notes-for-user-${parentId}`)
          .listen('NoteCreated', (e: NewNoteEventPayload) => {
            if (e.note) {
              handleNewNote(e.note);
            } else {
              console.error('Received incomplete note:', e.note);
            }
          });
        }
    
      // New logic for listening to new notifications
      echo.channel('new-notification').listen('NotificationCreated', (e: NewNotificationEventPayload) => { // Updated type here
        if (e.notification) {
          handleNewNotification(e.notification);
        } else {
          console.error('Received incomplete notification:', e.notification);
        }
      });


      // Cleanup
      // Cleanup: Leave the channel
      return () => {
        if (echo && userId) {
          console.log("Cleanup function called");
          
          userChannel.stopListening('NoteCreated');
          console.log("Cleanup function called");
          if (parentChannel) {
            parentChannel.stopListening('NoteCreated');
          }
          echo.leave('new-notification');
        }
      };
    }
  }, [echo, userId]);

  

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
      
      {/* <div>
        hej
  {notifications.map((notification, index) => (
    <div key={index}>
      {notification.note_title}
    </div>
  ))}
</div> */}
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
              {note.user_name ? note.user_name.charAt(0).toUpperCase() : ''}
              </div>
              <div
                className="absolute left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white rounded px-2 py-1 text-xs select-none"
                style={{ transition: 'opacity 0.2s' }}
              >
                {note.user_name}
              </div>
            </div>
            <EditModal note={note} onClose={() => {/* As mentioned, potential additional operations after closing */}}/>
            <PrimaryButton onClick={() => handleDelete(note.id)}>
                <FaTrashRestore />
            </PrimaryButton>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Show;
