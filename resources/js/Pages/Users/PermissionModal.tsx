import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';  // Importing your existing Modal component
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';

interface Permission {
  id: number;
  name: string;
  hasPermission: boolean;
}

const PermissionModal: React.FC<{ show: boolean, onClose: () => void, selectedUserId: number | null, onPermissionsUpdate: (permissions: string[]) => void }> = ({ show, onClose, selectedUserId, onPermissionsUpdate }) => {
    const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get(`users/${selectedUserId}/permissions`)
        .then(response => {
          setPermissions(response.data);
        });
    }
  }, [selectedUserId]);

  // New function to update permissions
  const updatePermissions = async (userId: number, updatedPermissionIds: number[]) => {
    try {
      const response = await axios.post(`users/${userId}/permissions`, {
        permissions: updatedPermissionIds
      });
      console.log("Permissions updated:", response.data);
    } catch (error) {
      console.error("Failed to update permissions", error);
    }
  };

  // Updated togglePermission function
  const togglePermission = (permissionId: number) => {
    if (selectedUserId) {
      axios.post(`users/${selectedUserId}/permissions/${permissionId}`)
        .then(() => {
          setPermissions(prevPermissions => {
            const updatedPermissions = prevPermissions.map(p => {
              if (p.id === permissionId) {
                return {...p, hasPermission: !p.hasPermission};
              }
              return p;
            });
            const newPermissionsList = updatedPermissions.filter(p => p.hasPermission).map(p => p.name);
            onPermissionsUpdate(newPermissionsList); // update permissions in parent component
            return updatedPermissions;
          });
        });
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-center">Set Permissions</h2>
        <ul className='flex flex-wrap'>
          {permissions.map(permission => (
            <li className='' key={permission.id}>
              <label>
                <Checkbox
                className='m-3'
                  type="checkbox"
                  checked={permission.hasPermission}
                  onChange={() => togglePermission(permission.id)}
                />
                {permission.name}
              </label>
            </li>
          ))}
        </ul>
        <PrimaryButton onClick={onClose} className='mt-2'>
            Done
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default PermissionModal;
