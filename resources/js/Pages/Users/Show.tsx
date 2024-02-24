import React, { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps, SuperAdminUsers, User } from '@/types';
import PermissionModal from './PermissionModal';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import { usePermissions } from '../../../providers/permissionsContext';

import { Switch } from '@headlessui/react';
import UserSwitch from '@/Components/UserSwitch';
import ProductChannelsHandler from '../Products/ProductChannelsHandler';
import UserChannelsHandler from './UserChannelsHandler';

import EditUserModal from './Components/EditUserModal';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';

interface Permission {
  name: string;
  hasPermission: boolean;
}

const Show: React.FC<PageProps> = ({ auth }) => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { setUserPermissions } = usePermissions(); // Using the usePermissions hook
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const [users, setUsers] = useState<User[]>([]);

  const [filteredUsers, setFilteredUsers] = useState(auth.allUserIdsUnderSameParent);

  const [searchTerm, setSearchTerm] = useState('');

  /* const [forceUpdate, setForceUpdate] = useState(false);

  setForceUpdate(f => !f); // Toggle the flag */

  useEffect(() => {
    axios.get('user-roles') // Replace with your actual API endpoint
      .then(response => {
        setUserRoles(response.data?.roles);
      });
  }, []);

  const openPermissionModal = (userId: number) => {
    setSelectedUserId(userId);
    setShowPermissionModal(true);
  };

  const closePermissionModal = () => {
    setShowPermissionModal(false);
  };

  // Function to update user permissions in the context
  const handlePermissionsUpdate = (updatedPermissions: string[]) => {
    const newPermissions: Permission[] = updatedPermissions.map(name => ({
      name,
      hasPermission: true, // Assuming the updated permissions are granted
    }));
    setUserPermissions(newPermissions);
  };


  useEffect(() => {
    if (searchTerm === '') {
        setFilteredUsers(auth.allUserIdsUnderSameParent);
        return;
    }

    if (searchTerm.length >= 3) {

        // Fetch filtered products based on search term
        const fetchFilteredProducts = async () => {
            try {
                const response = await axios.get(`/users?search=${searchTerm}`);
                if (response.data && response.data.auth && response.data.auth.allUserIdsUnderSameParent) {
                    setFilteredUsers(response.data.auth.allUserIdsUnderSameParent);
                }
            } catch (error) {
                console.error('Failed to fetch filtered users:', error);
            }
        };

        fetchFilteredProducts();

    } else {
        setFilteredUsers(auth.allUserIdsUnderSameParent);
    }
  }, [searchTerm, auth.user]);

  const handleReset = () => {
    setSearchTerm('');   
  }

  /* const toggleUserActive = (userId:number) => {
    axios.post(`/users/${userId}/toggle-active`)
      .then(response => {
        const updatedUsers = users.map(user => {
          if (user.id === userId) {
            // Assuming the response includes the updated user state
            return { ...user, is_active: !user.is_active };
          }
          return user;
        });
        setUsers(updatedUsers);
        console.log(updatedUsers); // Debugging
      })
      .catch(error => {
        console.error("Error toggling user's status", error);
      });
  }; */

  const toggleUserActive = (userId: number, isActive: boolean) => {
    axios.post(`/users/${userId}/update-details`, { is_active: !isActive })
      .then(response => {
        // Assuming the response includes the full updated user object
        const updatedUser = response.data.user;
  
        // Update the local state to reflect the change
        setFilteredUsers(filteredUsers.map(user => user.id === userId ? { ...user, ...updatedUser } : user));
      })
      .catch(error => {
        console.error("Error updating user's status", error);
      });
  };

  const handleUpdatedUser = (updatedUser: User) => {
    console.log("Updated user event triggered", updatedUser);
  
    // Assuming setFilteredUsers updates the state that reflects in the UI
    setFilteredUsers(prevUsers =>
      prevUsers.map(user => 
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

/* useEffect(() => {
  // Perform side effects here
  console.log('Users state changed.', users);
  setFilteredUsers(auth.allUserIdsUnderSameParent);
}, []); // Dependency array includes `users` to run the effect on its change */
  

  /* useEffect(() => {
    // Perform side effects here
    console.log('Users state changed.', users);
  }, [users]); // Dependency array includes `users` to run the effect on its change */
  
    /* console.log(auth.user.id); */

    
  return (
    <MainLayout title='Show all users'>

      <UserChannelsHandler
          userId={auth.user?.id ?? null}
          parentId={auth.user?.user_id ?? null}
          onUpdateUser={handleUpdatedUser}
      />
      <div className='bg-white dark:bg-gray-800 p-4 rounded-xl'>
        <h1 className="text-2xl font-semibold mb-4">User List</h1>

        <div className="flex gap-2">
                <TextInput
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Search..."
                    className='flex gap-2'
                />
                <DangerButton onClick={handleReset}>Reset</DangerButton>
        </div>

        <div className='overflow-x-auto'>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal border-y-2">
                <th className="py-2 px-6 text-left">ID</th>
                <th className="py-2 px-6 text-left">Name</th>
                <th className="py-2 px-6 text-left">Email</th>
                <th className="py-2 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
              {filteredUsers.map((user, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="py-2 px-6">{user.id}</td>
                  <td className="py-2 px-6">{user.name}</td>
                  <td className="py-2 px-6">{user.email}</td>
                  {Array.isArray(userRoles) && userRoles.find(role => role === 'admin') && (
                    <td className='py-2 px-6'>
                      <PrimaryButton onClick={() => openPermissionModal(user.id)}>Set Permissions</PrimaryButton>
                    </td>
                  )}
                  {Array.isArray(userRoles) && userRoles.find(role => role === 'admin') && (
                    <td className='py-2 px-6'>
                      <EditUserModal user={user} onClose={() => {/* As mentioned, potential additional operations after closing */}}/>
                    </td>
                    )} 
                    {Array.isArray(userRoles) && userRoles.find(role => role === 'admin') && (
                      <UserSwitch
                        isActive={user.is_active}
                        onChange={() => toggleUserActive(user.id, user.is_active)}
                      />
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
          onPermissionsUpdate={handlePermissionsUpdate}
        />
      </div>
    </MainLayout>
  );
};

export default Show;
