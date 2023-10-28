import React, { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';  // Adjust this import to your actual file structure
import { PageProps } from '@/types';
import PermissionModal from './PermissionModal';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

const Show: React.FC<PageProps> = ({ auth }) => {

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]); // Added new state

  const openPermissionModal = (userId: number) => {
    setSelectedUserId(userId);
    setShowPermissionModal(true);
  };

  const closePermissionModal = () => {
    setShowPermissionModal(false);
  };

  // New function to update user permissions
  const handlePermissionsUpdate = (updatedPermissions: string[]) => {
    setUserPermissions(updatedPermissions);
  };

  const [userRoles, setUserRoles] = useState<string[]>([]);


    useEffect(() => {
        axios.get('user-roles') // Replace with your actual API endpoint
            .then(response => {
                setUserRoles(response.data?.roles);
                console.log(response.data?.roles);
            });
    }, []);


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
                
              {Array.isArray(userRoles) && userRoles.find(role => role === 'admin') && (
                <td className='py-2 px-4 border'>
                  <PrimaryButton onClick={() => openPermissionModal(user.id)}>Set Permissions</PrimaryButton>
                </td>
              )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PermissionModal
        show={showPermissionModal}
        onClose={closePermissionModal}
        selectedUserId={selectedUserId}
        onPermissionsUpdate={handlePermissionsUpdate} // Pass the new prop
      />
    </MainLayout>
  );
}

export default Show;
