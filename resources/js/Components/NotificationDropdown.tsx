import React, { useState } from 'react';
import { useNotifications } from '../../providers/NotificationContext';

const NotificationDropdown: React.FC = () => {
    const { notifications, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    // Toggle dropdown
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Handle mark as read
    const handleMarkAsRead = (id: number) => {
        markAsRead(id);
        toggleDropdown(); // Optionally close the dropdown
    }

    if (!Array.isArray(notifications)) {
        return <div>Loading or no notifications...</div>;
    }

    return (
        <div className="notification-dropdown">
            <button onClick={toggleDropdown} className="dropdown-toggle">
                Notifications ({notifications.length})
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    {notifications.length > 0 ? notifications.map(notification => (
                        <div key={notification.id} className="notification-item">
                            <p>{notification.title}</p>
                            <button onClick={() => handleMarkAsRead(notification.id)} className="mark-read">
                                Mark as Read
                            </button>
                        </div>
                    )) : (
                        <div className="notification-item">No notifications</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
