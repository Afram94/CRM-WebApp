import React from 'react';
import { Switch } from '@headlessui/react';

const UserSwitch = ({ isActive, onChange } : any) => {
  return (
    <Switch
      checked={isActive}
      onChange={onChange}
      className={`${
        isActive ? 'bg-green-500' : 'bg-gray-400'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
      <span
        className={`${
          isActive ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
      />
    </Switch>
  );
};

export default UserSwitch;
