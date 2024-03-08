import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
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
    <div style={{ height: '100%', overflowY: 'auto', padding: '10px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.map(user => (
        <div
          className={`dark:bg-slate-700 dark:text-slate-400 rounded-lg my-3 p-2 cursor-pointer ${user.id.toString() === selectedUserId ? 'bg-blue-500 text-white' : ''}`}
          key={user.id}
          onClick={() => onSelectUser(user.id.toString())}
          style={{
            backgroundColor: user.id.toString() === selectedUserId ? '#3182ce' : '',
            color: user.id.toString() === selectedUserId ? 'white' : '',
          }}
        >
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
};

export default UserList;
