import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Notification {
  id: number;
  title: string;
  message: string;
  seen: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  markAsRead: (notificationId: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/notifications', {
                    withCredentials: true  // Important for sessions to work across different domains/ports
                });
                const data = Array.isArray(response.data) ? response.data : [];
                console.log('Fetched Notifications:', data);
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
                setNotifications([]);
            }
            setLoading(false);
        };
    
        fetchNotifications();
    }, []);
    
    

    const markAsRead = async (notificationId: number) => {
        try {
            await axios.put(`/notifications/${notificationId}`, { seen: true });
            setNotifications(notifications.map(notification =>
                notification.id === notificationId ? { ...notification, seen: true } : notification
            ));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, loading, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};
