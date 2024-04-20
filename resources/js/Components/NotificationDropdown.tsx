// src/components/NotificationDropdown.tsx
import React from 'react';
import { useNotifications } from '../../providers/NotificationContext';

const NotificationDropdown = () => {
    const { notifications } = useNotifications();

    return (
        <div className="relative">
            <button className="bg-gray-200 p-2 rounded-full">
                Notifications ({notifications.length})
            </button>
            {notifications.length > 0 && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
                    {notifications.map((notification, index) => (
                        <div key={index} className="px-4 py-2 hover:bg-gray-100">
                            {notification.title}: {notification.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
