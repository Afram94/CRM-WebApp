import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useEcho } from './WebSocketContext'; // Adjust this import path as needed

interface Permission {
  name: string;
  hasPermission: boolean;
}

interface PermissionsContextProps {
  userPermissions: Permission[];
  setUserPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
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
  const [userId, setUserId] = useState<number | null>(null);
  const echo = useEcho();

  useEffect(() => {
    // Fetch current user
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
    if (userId && echo) {
      axios.get(`http://127.0.0.1:8000/users/${userId}/permissions`)
        .then(response => {
          setUserPermissions(response.data);
        });
  
      console.log("Setting up WebSocket listener for user:", userId);
      const permissionsChannel = echo.private(`permissions-for-user.${userId}`);
  
      permissionsChannel.listen('.UserPermissionsUpdated', (e: { permissions: Permission[] }) => {
        console.log("UserPermissionsUpdated event received:", e.permissions);
        setUserPermissions(e.permissions);
      });
  
      return () => {
        console.log("Stopping WebSocket listener for user:", userId);
        permissionsChannel.stopListening('.UserPermissionsUpdated');
      };
    }
  }, [echo, userId]);

  return (
    <PermissionsContext.Provider value={{ userPermissions, setUserPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsProvider;
