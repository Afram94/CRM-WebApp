import React from 'react';
import ThemeToggle from './ThemeToggle';
import WidthToggle from './WidthToggle';
import ColorPicker from './ColorPicker';
import TextInput from './TextInput';
import UserDropdown from './UserDropdown';
import { useNotifications } from '../../providers/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const Header = ({ user }: any) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 shadow-md flex justify-between items-center rounded-lg mt-1">
      {/* Search Input */}
      <TextInput 
        className="bg-gray-100 dark:bg-gray-700 rounded placeholder-gray-500"
        placeholder='Search ..'
      />

      {/* Toggles and Color Picker */}
      <div className="flex items-center gap-4">
        {/* Color Picker */}
        <ColorPicker />

        {/* Theme and Width Toggles */}
        <div className="flex flex-col items-center gap-1">
          <ThemeToggle />
          <WidthToggle />
          <NotificationDropdown />
        </div>

        {/* User Dropdown */}
        <UserDropdown />
      </div>
    </div>
  );
};

export default Header;
