import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { FaMoon, FaSun } from 'react-icons/fa'; // Importing icons

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const className = 'dark';
    const element = document.documentElement;
    if (darkMode) {
      element.classList.add(className);
      localStorage.setItem('theme', 'dark');
    } else {
      element.classList.remove(className);
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Switch
      checked={darkMode}
      onChange={setDarkMode}
      className={`${
        darkMode ? 'bg-teal-500' : 'bg-gray-400'
      } relative inline-flex items-center w-[62px] h-7 transition-colors duration-300 ease-in-out rounded-full border-2 border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
    >
      {/* Icons */}
      <FaSun className="text-yellow-400 absolute left-1" />
      <FaMoon className="text-gray-600 absolute right-1" />
      
      {/* Toggle thumb */}
      <span
        aria-hidden="true"
        className={`${
          darkMode ? 'translate-x-8' : 'translate-x-0'
        } inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out `}
      />
    </Switch>
  );
};

export default ThemeToggle;
