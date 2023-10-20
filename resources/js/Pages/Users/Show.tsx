import React from 'react';
import MainLayout from '@/Layouts/MainLayout';  // Adjust this import to your actual file structure
import { PageProps } from '@/types';

const Show: React.FC<PageProps> = ({ auth }) => {
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">User List</h1>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {auth.allUserIdsUnderSameParent.map((user, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{user.id}</td>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

export default Show;
