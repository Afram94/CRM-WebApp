import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';


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

  return (
    <div className='' style={{ height: '100%', overflowY: 'auto', padding: '10px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.map(user => (
        <div
        className={`border dark:border-slate-400 border-slate-300 shadow-md dark:text-slate-400 rounded-lg my-3 p-2 cursor-pointer ${user.id.toString() === selectedUserId ? 'bg-indigo-500 dark:bg-gray-300 dark:text-slate-700 text-slate-200' : ''}`}
        key={user.id}
        onClick={() => onSelectUser(user.id.toString())}
      >
        <div className={`font-bold`}>{user.name} - </div>
        <div className='truncate'>
          {user.last_message ? user.last_message : '....'}
          {/* {user.last_message_date && 
            <span> - {format(new Date(user.last_message_date), 'PPPpp')}</span>} */}
        </div>
      </div>
      ))}
    </div>
  );
};

export default UserList;
