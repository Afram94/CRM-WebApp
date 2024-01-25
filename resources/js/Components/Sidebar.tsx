import React from 'react';
import { Link } from '@inertiajs/react';

import { FaHome, FaTags, FaCog, FaBars, FaUsers, FaUserTie, FaStickyNote, FaShoppingCart, FaThList } from 'react-icons/fa';
import { MdCategory, MdOutlineInventory2 } from 'react-icons/md';

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
    { name: 'Customers', path: '/customers', icon: FaUserTie },
    { name: 'Notes', path: '/notes', icon: FaStickyNote },
    { name: 'Users', path: '/users', icon: FaUsers },
    { name: 'Categories', path: '/categories', icon: MdCategory },
    { name: 'Products', path: '/products', icon: FaTags },
    { name: 'Inventory', path: '/inventories', icon: MdOutlineInventory2 },
    { name: 'Orders', path: '/orders', icon: FaShoppingCart },
    { name: 'Custom Fields', path: '/custom-fields', icon: FaThList },
    { name: 'Invite', path: '/generate-invite', icon: FaThList },
    { name: 'Settings', path: '/settings', icon: FaCog }
    // Add more pages as needed
  ];

  return (
    <div 
      // Dynamic class assignment for the sidebar. If isOpen is true, it's wider; otherwise, it's narrower.
      className={`transition-all duration-700 ease-in-out ${isOpen ? 'w-64' : 'w-20'} animated-gradient_sideBar  h-full p-4`}
      >
      <div onClick={toggleSidebar} className='flex justify-center cursor-pointer'>
        <FaBars size={24} className='text-white' />
      </div>

      <div className='mt-4'>
        {/* Map over the pages array to dynamically render the links */}
        {pages.map((page) => (
          <Link key={page.name} href={page.path}>
            <div className={`mb-4 flex items-center w-full 
                ${isOpen ? '' : 'justify-center'} 
                ${page.path === currentPath ? 'animated-gradient_3 text-gray-800 font-bold' : 'text-white hover:bg-gray-500 transition-bg duration-500 ease-in-out'} 
                rounded-lg p-2
              `}>
              <page.icon className="" size={26}/>
              {isOpen && <p className="ml-4 ">{page.name}</p>}
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
