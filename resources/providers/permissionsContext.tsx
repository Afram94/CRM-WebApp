import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // or your preferred way of making HTTP requests

interface Permission {
  name: string;
  hasPermission: boolean;
}

interface PermissionsContextProps {
  userPermissions: Permission[]; // Note the change here
  setUserPermissions: React.Dispatch<React.SetStateAction<Permission[]>>; // And here
}

interface PermissionsProviderProps {
    children: React.ReactNode;
  }

const PermissionsContext = createContext<PermissionsContextProps | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};




export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);

  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Moved this useEffect inside the functional component
    const fetchUser = async () => {
      try {
        const response = await axios.get('/current-user');
        console.log(response.data);
        setUserId(response.data.id); // Assuming response.data contains the user ID
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) { // Check if userId is available
      axios.get(`http://127.0.0.1:8000/users/${userId}/permissions`)
        .then(response => {
          setUserPermissions(response.data);
        });
    }
  }, [userId]);

  return (
    <PermissionsContext.Provider value={{ userPermissions, setUserPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
