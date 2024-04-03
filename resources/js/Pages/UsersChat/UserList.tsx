import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import TextInput from '@/Components/TextInput';


interface User {
  id: number;
  name: string;
  email: string;
  last_message: string | null;
  last_message_date: string | null;
}


interface UserListProps {
  onSelectUser: (userId: string) => void;
  selectedUserId: string | null;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser, selectedUserId }) => { // Add selectedUserId here
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [userName, setUserName] = useState<string | null>(null); // State to hold the current user's Name

  useEffect(() => {
    axios.get('/chat/list-users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        setError("Error fetching users: " + error.message);
        console.error("Error fetching users:", error);
      });
  }, []);


  useEffect(() => {
    // Fetch current user ID
    const fetchUser = async () => {
      try {
        const response = await axios.get('/current-user');
        setUserName(response.data.name); // Set the current user ID
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchUser();
  }, []);

  // Extract the first letter of the userName
  /* const firstLetter = userName.charAt(0).toUpperCase(); */

  return (

    <div className='dark:bg-[#2B2C3F]'>
      <div className='mx-3 pt-5 flex justify-start w-full'>
      <div className='w-10 h-10 bg-indigo-500 dark:bg-[#1c1d32] text-white rounded-full flex justify-center items-center font-bold mr-3'>
          {userName?.charAt(0).toUpperCase()}
        </div>
        
        <TextInput className='' placeholder='Search...' />
      </div>

      <div className='' style={{ height: '100%', overflowY: 'auto', padding: '10px' }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {users.map(user => (
          <div
          className={`border dark:border-slate-400 border-slate-300 shadow-md dark:text-slate-400 rounded-lg my-3 p-2 cursor-pointer ${user.id.toString() === selectedUserId ? 'bg-indigo-500 dark:bg-gray-300 dark:text-slate-700 text-slate-200' : ''}`}
          key={user.id}
          onClick={() => onSelectUser(user.id.toString())}
        >
          <div className={`font-thin`}>{user.name} {/* - {user.email} */}</div>
          <div className='truncate text-sm'>
            {user.last_message ? user.last_message : '....'}
            {/* {user.last_message_date && 
              <span> - {format(new Date(user.last_message_date), 'PPPpp')}</span>} */}
          </div>
        </div>
        ))}
      </div>

    </div>
  );
};

export default UserList;
