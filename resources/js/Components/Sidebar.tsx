// src/Components/Sidebar.tsx

import { Link } from '@inertiajs/react';
import React from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

type SidebarProps = {
  isOpen: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div 
      className={`transition-transform duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'} bg-gray-700 h-full p-4`}
    >
<div className='flex justify-center font-bold text-white uppercase text-md'>Crm System</div>
        <div className='mt-4'>

        
    <Link href="/dashboard">
      <div className="mb-4 flex items-center">
        {/* Home Icon */}
        <FaHome className="text-white" size={24} onClick={() => isOpen = false}/>
        {isOpen && <span className="ml-4 text-white">Home</span>}
      </div>
    </Link>

      <Link href="/customers">
        <div className="mb-4 flex items-center">
            {/* User Profile Icon */}
            <FaUser className="text-white" size={24} />
            {isOpen && <span className="ml-4 text-white">Customers</span>}
        </div>
      </Link>
      <div className="mb-4 flex items-center">
        {/* Settings Icon */}
        <FaCog className="text-white" size={24} />
        {isOpen && <span className="ml-4 text-white">Settings</span>}
      </div>
      </div>
      {/* ... add more items as needed */}
    </div>
  );
};

export default Sidebar;
