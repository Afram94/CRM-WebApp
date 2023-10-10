// src/components/Header.tsx

import React from 'react';

type HeaderProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Header: React.FC<HeaderProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className="bg-gray-500 p-4 text-white flex justify-between items-center">
      <button onClick={toggleSidebar}>
        {isOpen ? "Hide Sidebar" : "Show Sidebar"}
      </button>
      <h1>Logo</h1>
    </div>
  );
};

export default Header;
