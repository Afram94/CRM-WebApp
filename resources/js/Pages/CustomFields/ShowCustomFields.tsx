import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import CreateCustomerCustomFieldsModal from '../../Pages/CustomFields/CustomersCustomFields/Components/CreateCustomerCustomFieldsModal'
import EditCustomerCustomFieldsModal from '../../Pages/CustomFields/CustomersCustomFields/Components/EditCustomerCustomFieldsModal'
import axios from 'axios';

const Show = ({ auth }: PageProps) => {
    const { customer_custom_fields, product_custom_fields } = auth;

    const handleDelete = async (customerCustomFieldsId: number) => {
      try {
        const response = await axios.delete(`/customer-custom-fields/${customerCustomFieldsId}`);
        console.log(response.data);

      } catch (error) {
        console.log("Error deleting the custom field");
      }
    }


    const deleteProduct = async (productId: number) => {
      try {
          const response = await axios.delete(`/products/${productId}`);
          console.log(response.data);
          // Update UI or redirect as needed
      } catch (error) {
          console.error('Error deleting product', error);
          // Handle errors
      }
  };
    

    return (
        <MainLayout title="/Custom-Fields">

          <div className='grid grid-cols-1 gap-4'>

            <div className='border dark:border-slate-500 border-slate-200 '>
              <div className='flex justify-between bg-indigo-100 dark:bg-slate-800 py-2'>
                <h2 className="text-2xl p-2 ml-3 cursor-pointer flex justify-start items-start text-start rounded-t-md text-indigo-400 font-semibold">Customer Custom Fields</h2>
                <span className='flex items-center'>
                    <CreateCustomerCustomFieldsModal />
                </span>
              </div>
                
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal border-y-2 dark:border-slate-400 border-slate-300">
                                <th className="py-2 px-6 text-start">Field Name</th>
                                <th className="py-2 px-6 text-start">Type</th>
                                <th className="py-2 px-6 text-start">Created At</th>
                                <th className="py-2 px-6 text-start">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
                            {customer_custom_fields.map(field => (
                                <tr key={field.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <td className="py-2 px-6">{field.field_name}</td>
                                    <td className="py-2 px-6">{field.field_type}</td>
                                    <td className="py-2 px-6">{new Date(field.created_at).toLocaleDateString()}</td>
                                    
                                    <td className="py-2 px-6 flex gap-3">
                                      <span className="w-7 h-7 flex justify-center items-center bg-blue-100 rounded-full cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out">
                                          <EditCustomerCustomFieldsModal customerCustomField={field} onClose={() => {/* As mentioned, potential additional operations after closing */}}/>
                                            {/* <FaEdit size={17} color="#00A2F3"/> */}
                                      </span>
                                      <span onClick={()=>handleDelete(field.id)} className="w-7 h-7 flex justify-center items-center bg-red-100 rounded-full cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out">
                                          <FaTrash size={17} color="#FF5C5C"/>
                                      </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                
            </div>

            <div className='border dark:border-slate-500 border-slate-200 '>
            <div className='flex justify-between bg-indigo-100 dark:bg-slate-800 py-2'>
            <h2 className="text-2xl p-2 ml-3 cursor-pointer flex justify-start items-start text-start rounded-t-md text-indigo-400 font-semibold"> Product Custom Fields </h2>
                <span className='flex items-center'>
                    <CreateCustomerCustomFieldsModal />
                </span>
              </div>
            
                    <table className="min-w-full table-auto ">
                        <thead>
                            <tr className="text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal border-y-2 dark:border-slate-400 border-slate-300">
                                <th className="py-2 px-6 text-start">Field Name</th>
                                <th className="py-2 px-6 text-start">Type</th>
                                <th className="py-2 px-6 text-start">Created At</th>
                                <th className="py-2 px-6 text-start">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
                            {product_custom_fields.map(field => (
                                <tr key={field.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="py-2 px-6">{field.field_name}</td>
                                    <td className="py-2 px-6">{field.field_type}</td>
                                    <td className="py-2 px-6">{new Date(field.created_at).toLocaleDateString()}</td>
                                    <td className="py-2 px-6 flex gap-3">
                                      <span className="w-7 h-7 flex justify-center items-center bg-blue-100 rounded-full cursor-pointer">
                                          <FaEdit size={17} color="#00A2F3"/>
                                      </span>
                                      <span className="w-7 h-7 flex justify-center items-center bg-red-100 rounded-full cursor-pointer">
                                          <FaTrash size={17} color="#FF5C5C"/>
                                      </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            </div>
          </div>
                

                
        </MainLayout>
    );
};

export default Show;
