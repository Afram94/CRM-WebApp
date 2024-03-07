// Importing necessary libraries and types
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define a type for the user object
interface User {
  id: number;
  name: string;
  email: string;
}

// Define a type for the component props
interface UserListProps {
  onSelectUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ onSelectUser }) => {
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
        <div className='dark:bg-slate-700 dark:text-slate-400 rounded-lg my-3 p-2 cursor-pointer' key={user.id} onClick={() => onSelectUser(user.id.toString())}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
};

export default UserList;
