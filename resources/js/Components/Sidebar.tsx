import { Link } from '@inertiajs/react';
import React from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

// Type definition for the Sidebar props
type SidebarProps = {
  isOpen: boolean; // Determines if the sidebar is open or closed
  toggleSidebar: () => void; // Function to toggle sidebar state
};

// Sidebar functional component
const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {

    const currentPath = window.location.pathname;

  // Define an array of pages with name, path, and icon for dynamic rendering
  const pages = [
    { name: 'Home', path: '/dashboard', icon: FaHome },
    { name: 'Customers', path: '/customers', icon: FaUser },
    { name: 'Settings', path: '/settings', icon: FaCog }
    // Add more pages as needed
  ];

  return (
    <div 
      // Dynamic class assignment for the sidebar. If isOpen is true, it's wider; otherwise, it's narrower.
      className={`transition-transform duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'} bg-gray-700 h-full p-4`}
    >
      <div 
        className='flex justify-center font-bold text-white uppercase text-md cursor-pointer' 
        onClick={toggleSidebar} // On click, it will toggle the sidebar's open/close state
      >
        Crm 
        {/* Conditionally render the "-System" part based on the isOpen value */}
        <p className={ isOpen ? " " : "hidden" }> -System</p>
      </div>
      <div className='mt-4'>
        {/* Map over the pages array to dynamically render the links */}
        {pages.map((page) => (
          <Link key={page.name} href={page.path}>
            <div className={`mb-4 flex items-center w-full ${page.path === currentPath ? 'bg-gray-200 text-gray-800 rounded-lg p-2' : 'text-white'}`}> 
              {/* Render the appropriate icon for the page */}
              <page.icon className={`${page.path === currentPath ? ' text-gray-800 ' : 'text-white'}`} size={24}/>
              {/* If the sidebar is open, also display the name of the page */}
              {isOpen && <p className="ml-4 ">{page.name}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
