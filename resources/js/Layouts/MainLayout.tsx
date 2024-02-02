// Necessary imports for the MainLayout component
import React, { useEffect, useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import '../../css/global.css';

import { useWidth } from '../../providers/WidthContext';


// Type definition for the MainLayout props
type MainLayoutProps = {
  children: React.ReactNode;  // This represents any child components that will be wrapped by MainLayout
  title: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
    const { isFullWidth } = useWidth();
    // Try to get the sidebar's state (open or closed) from localStorage
    const initialIsOpen = localStorage.getItem('sidebarIsOpen') === 'true';
    // Set the sidebar's initial state based on the value retrieved from localStorage
    const [isOpen, setIsOpen] = useState(initialIsOpen);
  
    // A function to toggle the sidebar's state between open and closed
    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);  // It flips the value of isOpen
    };

    // A React effect that will run every time the value of 'isOpen' changes
    useEffect(() => {
        // Save the current state of the sidebar (isOpen) to the localStorage
        localStorage.setItem('sidebarIsOpen', String(isOpen));
    }, [isOpen]);  // The effect will re-run if and only if 'isOpen' changes

    return (
        <div className="flex h-screen animated-gradient_2 "> {/* bg-[#F3F3FA] dark:bg-[#1A202C] */}
            {/* // Render the Sidebar component and pass down its state and the toggle function as props */}
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

            {/* <div className="flex-1 flex flex-col overflow-hidden my-2 global-container gap-y-4"> */}
            <div className={`flex-1 flex flex-col overflow-hidden my-2 ${isFullWidth ? 'global-container-w-full' : 'global-container'} gap-y-4`}>

                {/* // Render the Header component */}
                <Header />

                <h1 className='text-2xl text-white dark:text-gray-300'>{title}</h1>

                {/* // This is where child components (passed to MainLayout) will be rendered */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto dark:bg-gray-800"> {/* bg-gray-200 */}
                    {children}
                </main>
            </div>
        </div>
    );
};

// Export the MainLayout component for use in other files
export default MainLayout;
