// src/components/Header.tsx

import React from 'react';

type HeaderProps = {
  /* isOpen: boolean; */
  /* toggleSidebar: () => void; */
};

const Header = () => {
  return (
    <div className="bg-white text-black p-4 shadow-md flex justify-between items-center rounded-lg mt-1">
      {/* <button onClick={toggleSidebar}>
        {isOpen ? "Hide Sidebar" : "Show Sidebar"}
      </button> */}
      <h1 className='text-gray-500'>Search here...</h1>
    </div>
  );
};

export default Header;
