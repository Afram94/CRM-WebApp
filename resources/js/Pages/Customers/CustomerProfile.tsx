// CustomerProfiles.tsx
import React, { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Order, PageProps } from '@/types';
import { TabComponent } from '@/Components/TabComponent';
import { FaBoxOpen, FaUser } from 'react-icons/fa';
import { IoCart, IoListSharp } from 'react-icons/io5';
import { MdAttachMoney, MdNote } from 'react-icons/md';
import axios from 'axios';
import ReusableListbox from '@/Components/DropdownSelect';

import { IconType } from 'react-icons';

const CustomerProfiles: React.FC<PageProps> = ({ auth }) => {
  /* const [selectedTab, setSelectedTab] = useState('Overview'); */

  // Step 2: Read from local storage on component mount or use 'Overview' as default
  const [selectedTab, setSelectedTab] = useState(() => {
    return localStorage.getItem('selectedTab') || 'Overview';
  });

  const tabCategories = [
    { name: 'Overview', Icon: FaUser },
    /* { name: 'Products', Icon: FaUser }, */
    { name: 'Orders', Icon: IoListSharp },
    { name: 'Address & Billing', Icon: FaUser },
    { name: 'Notifications', Icon: FaUser },
  ];

  const orderStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Canceled', value: 'canceled' },
  ];

  const [filterStatus, setFilterStatus] = useState('all');
  const filterOptions = [
    { label: 'All', value: 'all' },
    ...orderStatusOptions, // Assuming this includes 'pending', 'completed', 'canceled'
  ];
  
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);


  /* useEffect(() => {
    console.log(auth);
  }, []) */

  // Step 1: Save to local storage whenever selectedTab changes
  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab);
  }, [selectedTab]);


  const [orders, setOrders] = useState<Order[]>([]);

  // Defines an asynchronous function to update the status of an order.
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      // Attempts to send a PUT request to update the status of an order on the server.
      // The `orderId` determines which order to update, and `newStatus` is the new status value.
      await axios.put(`/orders/${orderId}`, { status: newStatus });

      // After a successful update on the server, iterates over the local orders state
      // to find the order with the matching `orderId` and update its status.
      const updatedOrders = orders.map(order => {
        // Checks if the current order in the map operation matches the order we want to update.
        if (order.id === orderId) {
          // If it matches, returns a new object with the same properties as the current order,
          // but with the `status` property updated to `newStatus`.
          return { ...order, status: newStatus };
        }
        // If it doesn't match, returns the order unchanged.
        return order;
      });

      // Sets the `orders` state to the newly created array of orders,
      // which includes the updated order status. This triggers a re-render of the component
      // with the updated orders data.
      setOrders(updatedOrders);
      console.log('Order status updated successfully');
    } catch (error) {
      // If the request fails (e.g., due to network issues or server errors),
      // logs an error message to the console.
      console.error('Failed to update order status:', error);
    }
  };

  // Uses the `useEffect` hook to perform side effects in the component.
  // In this case, it's used for initializing the `orders` state.
  useEffect(() => {
    setOrders(auth.customer_profile[0]?.orders || []);
  }, [auth.customer_profile]);
  

  // At the beginning of your component, you can destructure the first customer profile
  // if you're sure there will always be one in the auth object, otherwise, you might want to handle potential undefined values.
  const customer = auth.customer_profile[0];

  console.log(customer);

  /* // Calculate the total product quantity across all orders   // DELETE ___________________________ THIS ______________
  const totalProductsQuantity = customer?.orders?.reduce((total, order) => {
    return total + order.order_items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0) ?? 0;
 */
  // Calculate the total product quantity across all orders
  const totalProductsQuantity = customer?.orders?.reduce((total, order) => {
    // Provide an empty array as a fallback if order_items is undefined
    return total + (order.order_items || []).reduce((sum, item) => sum + item.quantity, 0);
  }, 0) ?? 0;


  
  interface CountCircleProps {
    bgColor: string;
    textColor: string;
    icon: IconType;
    count: number | string;
    label: string;
  }
  
  // Define a reusable component for the Count Circle
  const CountCircle: React.FC<CountCircleProps> = ({ bgColor, textColor, icon: Icon, count, label }) => (
    <div className="flex flex-col items-center">
      <div className={`relative bg-${bgColor}-200 rounded-full w-52 h-52 flex items-center justify-center shadow-lg`}>
        {/* Icon as background with low opacity */}
        <Icon className={`absolute text-${textColor}-500 text-9xl opacity-20`} />
        {/* Content container to ensure text appears above the icon */}
        <div className="z-10 text-center">
          <p className={`text-4xl font-bold text-${textColor}-800`}>{count}</p>
          <p className={`text-${textColor}-800 font-semibold text-xl`}>{label}</p>
        </div>
      </div>
    </div>
  );
  

  return (
    <MainLayout title="">
      <div className='m-5 bg-white p-2 rounded-lg dark:bg-gray-800'> {/* dark:bg-opacity-75 bg-opacity-75 */} {/* xl:h-screen */}
      {/* Replace hardcoded text with dynamic data */}
      <div className='text-gray-600 dark:text-gray-100 text-lg sm:text-xl md:text-2xl'>
        Customer ID #{customer?.id}
      </div>
      {/* Assuming you have a created_at field for customer and formatting it */}
      <div className='text-gray-500 dark:text-gray-100 text-sm sm:text-md md:text-lg mb-5'>
        {new Date(customer?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-3'> {/* h-screen */}

        <div className='flex flex-col gap-y-1 mt-24 mx-5 p-4 shadow-md rounded-lg bg-slate-100 dark:bg-gray-700 h-[500px]'> {/*   */}
          <div className='flex justify-center mb-4'>
            <FaUser className='bg-indigo-200 text-indigo-500 rounded-full p-3 h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 mt-4 animate-pulse' />
          </div>

          {/* Use actual customer name */}
          <div className='text-center text-gray-700 dark:text-gray-100 text-lg sm:text-xl md:text-2xl'>
            {customer?.name}
          </div>
          {/* Use actual customer ID */}
          <div className='text-center text-gray-600 dark:text-gray-100 text-sm sm:text-md'>
            Customer ID #{customer?.id}
          </div>
          
          {/* Assuming you have a way to calculate the total number of orders and amount spent */}
          <div className='flex flex-col sm:flex-row justify-center sm:gap-10 text-gray-700 dark:text-gray-100 my-4'>
            <div className='flex items-center justify-center my-2'>
              <IoCart className="w-10 h-10 text-indigo-500 bg-indigo-200 rounded-md p-2"/>
              <div className='mx-2'>
                {/* Assuming `orders` is an array of orders */}
                <p className='font-semibold '>{customer?.orders?.length ?? 0}</p>
                <p>Orders</p>
              </div>
            </div>

            <div className='flex items-center justify-center my-2'>
              <MdAttachMoney className="w-10 h-10 text-indigo-500 bg-indigo-200 rounded-md p-2" />
              <div className='mx-2'>
                {/* Calculate total spent, assuming `total` field in orders */}
                  <p className='font-semibold'>${(customer?.orders?.reduce((acc, order) => acc + Number(order.total), 0) ?? 0).toFixed(2)}</p>
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
            <div className="flex flex-wrap justify-center gap-4 mt-8 bg-slate-50 dark:bg-slate-700 p-12 rounded-lg">
              <CountCircle 
                bgColor="purple" 
                textColor="purple" 
                icon={MdNote} 
                count={customer?.notes?.length ?? 0} 
                label="Notes" 
              />
              <CountCircle 
                bgColor="blue" 
                textColor="blue" 
                icon={IoCart} 
                count={orders.length} 
                label="Orders" 
              />
              <CountCircle 
                bgColor="green" 
                textColor="green" 
                icon={FaBoxOpen} 
                count={totalProductsQuantity} 
                label="Products" 
              />
              <CountCircle 
                bgColor="purple" 
                textColor="purple" 
                icon={MdNote} 
                count={customer?.notes?.length ?? 0} 
                label="Notes" 
              />
              <CountCircle 
                bgColor="blue" 
                textColor="blue" 
                icon={IoCart} 
                count={orders.length} 
                label="Orders" 
              />
              <CountCircle 
                bgColor="green" 
                textColor="green" 
                icon={FaBoxOpen} 
                count={totalProductsQuantity} 
                label="Products" 
              />
              <CountCircle 
                bgColor="purple" 
                textColor="purple" 
                icon={MdNote} 
                count={customer?.notes?.length ?? 0} 
                label="Notes" 
              />
              <CountCircle 
                bgColor="blue" 
                textColor="blue" 
                icon={IoCart} 
                count={orders.length} 
                label="Orders" 
              />
              <CountCircle 
                bgColor="green" 
                textColor="green" 
                icon={FaBoxOpen} 
                count={totalProductsQuantity} 
                label="Products" 
              />
              
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

{selectedTab === 'Orders' && (
  <div className="p-4 mt-8 bg-slate-50 dark:bg-slate-700 rounded-lg">
    {orders.map((order) => (
      <div key={order.id} className={`mb-4 p-5 rounded-lg shadow-xl border border-gray-300 relative ${order.status === 'pending' ? 'bg-yellow-100' : order.status === 'completed' ? 'bg-green-100' : 'bg-red-100'}`}>
        
        {/* Accordion Toggle Button, Order Info, and Dropdown for Order Status */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-semibold mb-3 text-slate-600">
              Order ID: {order.id} <br />
              {order.created_at && `${new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}`}
            </h3>
          </div>
          <div className="flex items-center">
            {/* ReusableListbox for updating order status */}
            <ReusableListbox
              options={orderStatusOptions}
              selected={orderStatusOptions.find(option => option.value === order.status) || orderStatusOptions[0]}
              onChange={(selectedOption) => updateOrderStatus(order.id, selectedOption.value)}
              className="mr-4"
            />
            <button 
              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)} 
              className="text-sm font-semibold"
            >
              {expandedOrderId === order.id ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>

        {/* Accordion Content */}
        {expandedOrderId === order.id && (
          <div>
            <p className="text-base text-slate-600">Total: ${order.total}</p>
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2 text-slate-600">Items:</h4>
              <table className="min-w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.order_items?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product?.name ?? 'Product not found'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    ))}
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