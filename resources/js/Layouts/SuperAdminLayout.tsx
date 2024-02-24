// src/components/SuperAdminLayout.tsx
import { Link } from '@inertiajs/react';
import React from 'react';


interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold">Super Admin Dashboard</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/super-admin/dashboard" className="hover:text-blue-200">Dashboard</Link></li>
              <li><Link href="/super-admin/users" className="hover:text-blue-200">Users</Link></li>
              <li><Link href="/super-admin/settings" className="hover:text-blue-200">Settings</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="bg-blue-700 text-white w-64 space-y-6 py-7 px-2">
          {/* Sidebar content */}
          <nav>
            <ul className="flex flex-col space-y-2">
              <li><Link href="/super-admin/profile" className="hover:text-blue-300">Profile</Link></li>
              <li><Link href="/super-admin/messages" className="hover:text-blue-300">Messages</Link></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-5">
          {/* Main content area where child components will be rendered */}
          {children}
        </main>
      </div>
      <footer className="bg-blue-500 text-white text-center p-4">
        <p>Super Admin Dashboard © 2024</p>
      </footer>
    </div>
  );
};

export default SuperAdminLayout;
