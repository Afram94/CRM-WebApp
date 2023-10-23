// CustomersList.tsx

import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { FaTrash } from 'react-icons/fa';

import { PageProps } from '@/types';
import MainLayout from '@/Layouts/MainLayout';
import CreateModal from '@/Pages/Customers/Components/CreateModal';
import EditModal from './Components/EditModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { successToast } from '@/Components/toastUtils';
import Swal from 'sweetalert2';
import PaginationComponent from '@/Components/Pagination';
import { useEffect, useState } from 'react';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import Dropdown from '@/Components/Dropdown';
import SecondaryButton from '@/Components/SecondaryButton';
import CreateModalNotes from '../Notes/Components/CreateModalNotes';
import { Link } from '@inertiajs/react';

const Show = ({ auth }: PageProps) => {

    const Delete = (customerId: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(customerId);
            }
        });
    }

    const handleDelete = async (customerId: number) => {
        /* if(window.confirm('Are you sure you want to delete this customer?')) { */
          try {
            await axios.delete(`/customers/${customerId}`);
            successToast('The Customer has been deleted');
            setTimeout(() => {
                Inertia.reload({only: ['Show']}); // Delayed reload
            }, 1300); // Delay for 2 seconds. Adjust as needed
            // Any other post-delete operations, e.g. refreshing a list
          } catch (error) {
            
            console.error('There was an error deleting the customer:', error);
          }
        /* } */
        // .data (beacuse the pagination i use in the backedn)
      }

      const [filteredCustomers, setFilteredCustomers] = useState(auth.customers.data);
      const [searchTerm, setSearchTerm] = useState('');

      useEffect(() => {
        if (searchTerm === '') {
            setFilteredCustomers(auth.customers.data);
            return;
        }
    
        // Only search if searchTerm length is 3 or more
        if (searchTerm.length >= 3) {
            
            const fetchFilteredCustomers = async () => {
                try {
                    const response = await axios.get(`/customers?search=${searchTerm}`);
                    if (response.data && response.data.auth && response.data.auth.customers) {
                        setFilteredCustomers(response.data.auth.customers.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch filtered customers:', error);
                }
            };
    
            fetchFilteredCustomers();
    
        } else {
            // If searchTerm is between 1 and 2 characters, reset to the original list
            setFilteredCustomers(auth.customers.data);
        }
    }, [searchTerm, auth.customers.data]);


    const handleReset = () => {
        setSearchTerm('');
    };

    const downloadCsv = async () => {
        try {
            const response = await axios.get('/export-csv', {
                responseType: 'blob' // This is essential because the response is a Blob object representing binary data
            });
            
            // Create a Blob and download it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'customers.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log('Download Error:', error);
        }
    };

    const downloadSingleCustomerCsv = async (customerId: string | number) => {
        try {
          const response = await axios.get(`/export-single-customer-csv/${customerId}`, {
            responseType: 'blob'  // Important to set this
          });
      
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `single_customer_${customerId}.csv`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.log('Download Error:', error);
        }
      };
        
    
      
    return (
        <MainLayout>
            {auth.customers?.data && auth.customers.data.length > 0 ? (
                <div className="bg-white h-full p-4">
                    <h3 className="text-xl font-semibold mb-4 flex justify-center">Your Customers:</h3>
                    <div className="w-full flex justify-between my-2">
                        <div className="flex gap-2">
                            <TextInput 
                                type="text"
                                placeholder="Search..."
                                className='h-9'
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <DangerButton onClick={handleReset}>Reset</DangerButton>
                        </div>
                        <CreateModal />
                        <PrimaryButton onClick={downloadCsv} className="btn btn-primary">
                            Download Customers as CSV
                        </PrimaryButton>
                        {/* <CreateModalNotes customer={} /> */}
                    </div>
                    
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-2 px-6 text-left">Name</th>
                                <th className="py-2 px-6 text-left">Email</th>
                                <th className="py-2 px-6 text-left">Phone Number</th>
                                <th className="py-2 px-6 text-left">Edit</th>
                                <th className="py-2 px-6 text-left">Delete</th>
                                <th className="py-2 px-6 text-left">Other</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {filteredCustomers.map((customer) => (
                                <tr className="border-b border-gray-200 hover:bg-gray-100" key={customer.id}>
                                    <td className="py-2 px-6">{customer.name}</td>
                                    <td className="py-2 px-6">{customer.email}</td>
                                    <td className="py-2 px-6">{customer.phone_number}</td>
                                    <td className="py-2 px-6">
                                        <EditModal customer={customer} onClose={() => {/* As mentioned, potential additional operations after closing */}}/>
                                    </td>
                                    <td className="py-2 px-6">
                                        <PrimaryButton onClick={() => Delete(customer.id)}>
                                            <FaTrash />
                                        </PrimaryButton>
                                    </td>
                                    <td className="py-2 px-6">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <PrimaryButton>...</PrimaryButton>
                                            </Dropdown.Trigger>
                                            <Dropdown.Content>

                                                {/* Button to download CSV */}
                                                <PrimaryButton 
                                                    onClick={() => downloadSingleCustomerCsv(customer.id)} 
                                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                                                >
                                                    Download CSV
                                                </PrimaryButton>


                                                <PrimaryButton 
                                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                                                >
                                                    <Link href={`/notes/${customer.id}`}>
                                                        <a>Show Notes</a>
                                                    </Link>
                                                </PrimaryButton>

                                                {/* Divider or some spacing between the buttons */}
                                                <div className="my-2 border-t border-gray-200"></div>

                                                {/* Button to create a new note */}
                                                <div className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
                                                    <CreateModalNotes customerId={customer.id} />
                                                </div>

                                            </Dropdown.Content>
                                        </Dropdown>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {auth.customers.links && (
                        <div className="mt-4">
                            <PaginationComponent links={auth.customers.links} />
                        </div>
                    )}
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center h-full text-[30px] font-semibold'>
                    Add a new Customer
                    <span className='animate-pulse'><CreateModal /></span>
                </div>   
            )}
        </MainLayout>
    );
};

export default Show;
