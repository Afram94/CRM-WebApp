// CustomerProfiles.tsx
import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';
import { TabComponent } from '@/Components/TabComponent';
import { FaUser } from 'react-icons/fa';
import { IoCart } from 'react-icons/io5';
import { MdAttachMoney } from 'react-icons/md';

const CustomerProfiles: React.FC<PageProps> = ({ auth }) => {
  const [selectedTab, setSelectedTab] = useState('Overview');

  const tabCategories = [
    { name: 'Overview', Icon: FaUser },
    { name: 'Security', Icon: FaUser },
    { name: 'Address & Billing', Icon: FaUser },
    { name: 'Notifications', Icon: FaUser },
  ];

  return (
    <MainLayout>
      <div className='m-5'>
        <div className='text-gray-600 text-lg sm:text-xl md:text-2xl'>
          Customer ID #3085d6
        </div>
        <div className='text-gray-500 text-sm sm:text-md md:text-lg mb-5'>
          Aug 17, 2020, 5:48 (ET)
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

          <div className='shadow-md rounded-lg bg-slate-100 flex flex-col gap-y-1 mt-4 p-4'>
            <div className='flex justify-center mb-4'>
              <FaUser className='bg-indigo-200 text-indigo-500 rounded-full p-3 h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 mt-4' />
            </div>

            <div className='text-center text-gray-700 text-lg sm:text-xl md:text-2xl'>Afram Hanna</div>
            <div className='text-center text-gray-600 text-sm sm:text-md'>Customer ID #3085d6</div>
            
            <div className='flex flex-col sm:flex-row justify-center sm:gap-10 text-gray-700 my-4'>
              <div className='flex items-center justify-center my-2'>
                <IoCart className="w-10 h-10 text-indigo-500 bg-indigo-200 rounded-md p-2"/>
                <div className='mx-2'>
                  <p className='font-semibold '>184</p>
                  <p>Orders</p>
                </div>
              </div>

              <div className='flex items-center justify-center my-2'>
                <MdAttachMoney className="w-10 h-10 text-indigo-500 bg-indigo-200 rounded-md p-2" />
                <div className='mx-2'>
                  <p className='font-semibold'>$12,378</p>
                  <p>Spent</p>
                </div>
              </div>
            </div>
            <div className='border-b-2 border-indigo-500 mx-2'></div>

            <div className='mt-4'>
              <div className='text-gray-500 text-sm sm:text-md'>DETAILS</div>
              {auth.customer_profile.map((profile) => (
                <div className='gap-y-4' key={profile.id}>
                  <div className='flex flex-col sm:flex-row gap-x-2 mt-2'>
                    <div className='text-gray-600 font-semibold'>Username:</div>
                    <div className='text-gray-600'>{profile.name}</div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-x-2 mt-2'>
                    <div className='text-gray-600 font-semibold'>Email:</div>
                    <div className='text-gray-600'>{profile.email}</div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-x-2 mt-2'>
                    <div className='text-gray-600 font-semibold'>Phone number:</div>
                    <div className='text-gray-600'>{profile.phone_number}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='col-span-2'>
            <TabComponent
              categories={tabCategories}
              selectedTab={selectedTab}
              onSelect={(tab) => setSelectedTab(tab)}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CustomerProfiles;





{/* {selectedTab === 'Overview' && (
                <div className="flex flex-wrap justify-around">
                {auth.customer_profile.map((profile) => (
                    <div key={profile.id} className="m-4 p-5 rounded-lg shadow-lg border border-gray-300">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">
                        {profile.name}
                    </h3>
                    <p className="text-base mb-3 text-gray-800">Email: {profile.email}</p>
                    <p className="text-base mb-3 text-gray-800">Phone: {profile.phone_number}</p>
                    <div className="mt-4">
                        <h4 className="text-md font-semibold mb-2 text-gray-700">Notes:</h4>
                        {profile.notes && profile.notes.length > 0 ? (
                        profile.notes.map((note) => (
                            <div key={note.id} className="mb-2">
                            <p className="text-sm font-semibold text-gray-800">{note.title}</p>
                            <p className="text-sm text-gray-600">{note.content}</p>
                            </div>
                        ))
                        ) : (
                        <p className="text-sm text-gray-600">No notes available</p>
                        )}
                    </div>
                </div>
                ))}
                </div>
            )} */}