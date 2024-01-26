import React from 'react';
import ThemeToggle from './ThemeToggle';
import WidthToggle from './WidthToggle';

const Header = () => {
  return (
    <div className="bg-white dark:bg-gray-800 dark:bg-opacity-75 bg-opacity-75 text-black dark:text-white p-4 shadow-md flex justify-between items-center rounded-lg mt-1">
      {/* Existing elements like button and ThemeToggle */}
      <h1 className='text-gray-500 dark:text-gray-300'>Search here...</h1>
      <ThemeToggle/>
      <WidthToggle/>
    </div>
  );
};

export default Header;
