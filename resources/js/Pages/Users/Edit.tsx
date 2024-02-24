import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { User } from '@/types';
import { successToast } from '@/Components/toastUtils';

type UpdateProps = {
  user: User;
  closeModal: () => void;
};

const Update: React.FC<UpdateProps> = ({ closeModal, user }) => {
    const [data, setData] = useState<Partial<User>>({
        name: user.name,
        email: user.email,
        is_active: user.is_active,
    });

  const updateUser = async () => {
    try {
      const response = await axios.post(`/users/${user.id}/update-details`, data);
      successToast('User updated successfully');
      closeModal(); // Close modal on success
    } catch (error) {
      console.error("Error updating user", error);
      // Optionally use errorToast from '@/Components/toastUtils' if exists
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-2'>
        <TextInput
          type="text"
          placeholder="Name"
          value={data.name || ''}
          onChange={e => setData(prevData => ({ ...prevData, name: e.target.value }))}
        />
        <TextInput
          type="email"
          placeholder="Email"
          value={data.email || ''}
          onChange={e => setData(prevData => ({ ...prevData, email: e.target.value }))}
        />
      </div>
      <PrimaryButton className='mt-2' onClick={updateUser}>Update User</PrimaryButton>
    </>
  );
};

export default Update;
