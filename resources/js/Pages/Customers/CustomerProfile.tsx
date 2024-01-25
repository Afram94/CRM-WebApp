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
    { name: 'Products', Icon: FaUser },
    { name: 'Address & Billing', Icon: FaUser },
    { name: 'Notifications', Icon: FaUser },
  ];

  console.log(auth.customer_profile);

  return (
    <MainLayout title="">
      <div className='m-5 bg-white p-2 rounded-lg bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 xl:h-screen'>
        <div className='text-gray-600 dark:text-gray-100 text-lg sm:text-xl md:text-2xl'>
          Customer ID #3085d6
        </div>
        <div className='text-gray-500 dark:text-gray-100 text-sm sm:text-md md:text-lg mb-5'>
          Aug 17, 2020, 5:48 (ET)
        </div>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>

          <div className='shadow-md rounded-lg bg-slate-50 flex flex-col gap-y-1 mt-4 p-4 dark:bg-gray-700'>
            <div className='flex justify-center mb-4'>
              <FaUser className='bg-indigo-200 text-indigo-500 rounded-full p-3 h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 mt-4' />
            </div>

            <div className='text-center text-gray-700 dark:text-gray-100 text-lg sm:text-xl md:text-2xl'>Afram Hanna</div>
            <div className='text-center text-gray-600 dark:text-gray-100 text-sm sm:text-md'>Customer ID #3085d6</div>
            
            <div className='flex flex-col sm:flex-row justify-center sm:gap-10 text-gray-700 dark:text-gray-100 my-4'>
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
              <div className='text-gray-500 text-sm sm:text-md dark:text-gray-100'>DETAILS</div>
              {auth.customer_profile.map((profile) => (
                <div className='gap-y-4' key={profile.id}>
                  <div className='flex flex-col sm:flex-row gap-x-2 mt-2'>
                    <div className='text-gray-600 dark:text-gray-100 font-semibold'>Username:</div>
                    <div className='text-gray-600 dark:text-gray-100'>{profile.name}</div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-x-2 mt-2'>
                    <div className='text-gray-600 dark:text-gray-100 font-semibold'>Email:</div>
                    <div className='text-gray-600 dark:text-gray-100'>{profile.email}</div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-x-2 mt-2'>
                    <div className='text-gray-600 dark:text-gray-100 font-semibold'>Phone number:</div>
                    <div className='text-gray-600 dark:text-gray-100'>{profile.phone_number}</div>
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
            {selectedTab === 'Overview' && (
                <div> 
                
                    <div  className="mb-2">
                        {/* {profile.notes && profile.notes.length > 0 ?
                        profile.notes.map((note)=>( */}
                            <div className='grid grid-cols-2 gap-2'>

                                <div className='w-full p-3 h-44 shadow-md bg-white rounded-lg dark:bg-gray-700'>
                                    <div className='mb-2 flex flex-col gap-3'>
                                        <MdAttachMoney className="w-9 h-9 text-indigo-500 bg-indigo-200 rounded-md p-1" />
                                        <p className='text-xl text-gray-700 dark:text-gray-100'>Account Balance</p>
                                    </div>

                                    <div className='flex gap-1 mb-2'>
                                        <p className='text-indigo-600 dark:text-indigo-300 text-xl font-semibold'>$2345</p>
                                        <p className='text-[14px] my-1 text-gray-500 dark:text-gray-100 font-semibold'>Credit Left</p>
                                    </div>
                                    <p className='text-gray-500 dark:text-gray-100'>Account balance for next purchase</p>
                                </div>


                                {auth.customer_profile.map((profile) => (
                                  <div key={profile.id} className="mb-6">

                                    <div className='w-full p-3 shadow-md bg-white rounded-lg dark:bg-gray-700'>
                                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Notes</h3>
                                      {profile.notes && profile.notes.length > 0 ? (
                                        profile.notes.map((note) => (
                                          <div key={note.id} className='mb-4'>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{note.title}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-100">{note.content}</p>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-xl text-gray-500">No notes available</p>
                                      )}

                                    </div>
                                  </div>
                                ))}

                                {auth.customer_profile.map((profile) => (
                                <div key={profile.id} className="mb-6">
                                  {profile.products && profile.products.length > 0 ? (
                                    <div className="w-full p-3 shadow-md bg-white rounded-lg dark:bg-gray-700">
                                      <h3 className="text-lg font-semibold text-gray-800 mb-3 dark:text-gray-100">Products</h3>
                                      {profile.products.map((product) => (
                                        <div key={product.id} className="mb-2">
                                          {/* Render product details */}
                                          <p className="text-sm text-gray-600 dark:text-gray-100">{product.name}</p>
                                          {/* More product details */}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="w-full p-3 h-44 shadow-md items-center flex justify-center bg-white rounded-lg">
                                      <p className="text-xl text-gray-500">No products available</p>
                                    </div>
                                  )}
                                </div>
                              ))}

                            </div>
                    </div>
                </div>
            )}
            {selectedTab === 'Products' && (
            <div className="p-4">
              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-100 uppercase tracking-wider">
                        Product Name
                      </th>
                      {/* Add more headers for additional product details */}
                    </tr>
                  </thead>
                  <tbody>
                    {auth.customer_profile[0].products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-600 text-sm">
                          <p className="text-gray-900 dark:text-gray-100 whitespace-no-wrap">{product.category ? product.category.name : 'No category'}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-600 text-sm">
                          <p className="text-gray-900 dark:text-gray-100 whitespace-no-wrap">{product.name}</p>
                        </td>
                        {/* Render more product details in additional <td> elements */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


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