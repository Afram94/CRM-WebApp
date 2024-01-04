// CustomersList.tsx

import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { FaTrash, FaPlus } from 'react-icons/fa';

import { Customer, PageProps } from '@/types';
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

import { usePermissions } from '../../../providers/permissionsContext';
import CustomerCustomFieldForm from '../CustomFields/CustomersCustomFields/CreateCustomerCustomFieldForm';
import CustomerChannelsHandler from './CustomerChannelsHandler';
import Modal from '@/Components/Modal';
import AddProductModal from './Components/AddProductModal';

interface Permission {
    name: string;
    hasPermission: boolean;
  }


  
  

const Show = ({ auth }: PageProps) => {

    /* console.log("hehehehehehehehehehehehehehehehehehehe" + auth.user?.user_id)
    console.log("hahahahahahahaahahahah" + auth.user?.id) */

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
            /* setTimeout(() => {
                Inertia.reload({only: ['Show']}); // Delayed reload
            }, 1300); */ // Delay for 2 seconds. Adjust as needed
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
                        /* console.log("Debug: ", response.data.auth.customers.data); */
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

    /* console.log(filteredCustomers); */
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
        
      /* const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
      const [userId, setUserId] = useState(auth.user.id);
      
      useEffect(() => {
          axios.get(`users/${userId}/permissions`) // Replace userId with the actual user ID
          .then(response => {
              setUserPermissions(response.data);
              console.log(response.data);
          });
      }, []); */
      const { userPermissions } = usePermissions();

      /* const handleNewCustomer = (newCustomer: Customer) => {
        console.log("handleNewCustomer Work!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        setFilteredCustomers((prevCustomers) => {
          if (newCustomer.id) {  // Ensure the new note has a user name
            return [newCustomer, ...prevCustomers];
          } else {
            // Handle this case, e.g., provide a default name or fetch additional data
            console.error('New note does not have a user_name:', newCustomer);
            return prevCustomers;  // For now, keep the old notes as they were
          }
        });
      }; */

      /**
       * This function is called when a new customer is created.
       * It updates the state to include the new customer at the beginning of the list.
       * Because the UI displays a maximum of 5 customers per page (due to pagination),
       * we need to ensure that adding a new customer doesn't increase the count beyond 20.
       * If it does, we slice the array to remove the last customer,
       * effectively maintaining the correct number of customers on the current page.
       * This approach resolves an issue where the list displayed 21 customers after
       * a new customer was created until the page was refreshed.
       *
       * @param {Customer} newCustomer - The new customer to be added to the list.
       */
      const handleNewCustomer = (newCustomer: Customer) => {
        // Log to console whenever this function is triggered
        console.log("New customer event triggered");

        // Update state with a function to ensure we have the most current state
        setFilteredCustomers((prevCustomers) => {
          // Check if the new customer object has an ID property
          if (newCustomer.id) {
            // If it does, add the new customer to the start of the customer array
            const updatedCustomers = [newCustomer, ...prevCustomers];

            // After adding the new customer, check if we have more than 20 customers
            if (updatedCustomers.length > 20) {
              // If we do, return only the first 20 customers to stay within page limits
              return updatedCustomers.slice(0, 20);
            }

            // If we have 20 or fewer customers, return the updated list as is
            return updatedCustomers;
          } else {
            // If the new customer object lacks an ID, log an error for debugging
            console.error('New customer is missing an ID:', newCustomer);
            // Return the previous customer array unchanged
            return prevCustomers;
          }
        });
      };

      const handleUpdatedCustomer = (updatedCustomer: Customer) => {
        // Log to console whenever this function is triggered
        console.log("Updated customer event triggered");
    
        // Update state with a function to ensure we have the most current state
        setFilteredCustomers((prevCustomers) => {
            // Check if the updated customer object has an ID property
            if (updatedCustomer.id) {
                // Map over the existing customers
                const updatedCustomers = prevCustomers.map(customer => 
                    customer.id === updatedCustomer.id ? updatedCustomer : customer
                );
    
                // Return the updated customers array
                return updatedCustomers;
            } else {
                // If the updated customer object lacks an ID, log an error for debugging
                console.error('Updated customer is missing an ID:', updatedCustomer);
                // Return the previous customer array unchanged
                return prevCustomers;
            }
        });
    };

    const handleDeleteCustomer = (deletedCustomerId: number) => {
      console.log("handleDeleteNote Work!!", deletedCustomerId);
      setFilteredCustomers((prevCustomers) => prevCustomers.filter(customer => customer.id !== deletedCustomerId));
    };
    


      const maxFields = Math.max(...filteredCustomers.map(c => c.custom_fields_values?.length || 0));

      const distinctCustomFieldNames = [
        ...new Set(
            filteredCustomers
                .flatMap(c => c.custom_fields_values || [])
                .filter(field => field.custom_field) // Filter out any undefined custom_field
                .map(field => field.custom_field.field_name)
        )
    ];

    console.log(filteredCustomers);


    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

        const openModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
        };

        console.log(selectedCustomer);

    return (
        <MainLayout title="Customers / All Customers">
            
            {auth.customers?.data && auth.customers.data.length > 0 ? (
                
                <div className="bg-white dark:bg-gray-800 p-4">
            <CustomerChannelsHandler
              userId={auth.user?.id ?? null}
              parentId={auth.user?.user_id ?? null}
              onNewCustomer={handleNewCustomer}
              onUpdateCustomer={handleUpdatedCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
    
                    {/* <h3 className="text-xl font-semibold mb-4 flex justify-center">Your Customers:</h3> */}
                    <div className="w-full flex justify-between my-4">
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
                        {userPermissions.find(perm => perm.name === 'create customer' && perm.hasPermission) && (
                            <CreateModal />
                         )} 
                        <PrimaryButton onClick={downloadCsv} className="btn btn-primary">
                            Download Customers as CSV
                        </PrimaryButton>
                        {/* <CreateModalNotes customer={} /> */}
                    </div>

                    {/* <CustomerCustomFieldForm /> */}
                    
                    <div className='overflow-x-auto'>
                    <table className="min-w-full table-auto">
                        <thead>
                        <tr className="text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal border-y-2">
                                <th className="py-2 px-6 text-center sm:hidden"></th>
                                <th className="py-2 px-6 text-left">Customer</th>
                                {/* <th className="py-2 px-6 text-left">Email</th>
                                <th className="hidden sm:table-cell py-2 px-6 text-left">Phone Number</th> */}
                                {distinctCustomFieldNames.map(name => (
                                    <th className="hidden sm:table-cell py-2 px-6 whitespace-nowrap" key={name}>{name}</th>
                                ))}
                                {/* <th className="py-2 px-6 text-left">Last Name</th>
                                <th className="py-2 px-6 text-left">Org Number</th> */}
                                <th className="hidden sm:table-cell py-2 px-6">Edit</th>
                                <th className="hidden sm:table-cell py-2 px-6">Delete</th>
                                <th className="hidden sm:table-cell py-2 px-6">Other</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
                            {filteredCustomers.map((customer) => (
                                
                                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700" key={customer.id}>

                                    <td className="py-2 px-6 text-center sm:hidden"> {/* Hidden on small and up, shown on extra small */}
                                        <PrimaryButton onClick={() => openModal(customer)}>
                                            <FaPlus /> {/* Plus icon */}
                                        </PrimaryButton>
                                    </td>
                                    
                                    <td className="py-2 px-6">
                                    <Link href={`/customer-profile/${customer.id}`}>
                                        <div className='flex gap-1'>
                                            <p className='font-semibold text-indigo-500 text-[17px]'>{customer.name}</p>
                                            <p className='text-gray-400 py-[2px]'>Tel:{customer.phone_number}</p>
                                        </div>
                                            <p className='text-gray-500 mt-1'>Email:{customer.email}</p>
                                        
                                    </Link>
                                    </td>
                                    {/* <td className="py-2 px-6">
                                    <Link href={`/customer-profile/${customer.id}`}>{customer.email}</Link>
                                    </td>
                                    
                                    <td className="hidden sm:table-cell py-2 px-6">
                                    <Link href={`/customer-profile/${customer.id}`}>{customer.phone_number}</Link>
                                    </td> */}
                                    
                                    {/* Loop through customFieldsValues to display custom field data */}
                                    
                                    {Array.from({ length: maxFields }).map((_, index) => {
                                    if (customer.custom_fields_values && index < customer.custom_fields_values.length) {
                                        const customFieldValue = customer.custom_fields_values[index].custom_field;
                                        let displayValue = customer.custom_fields_values[index].value;
                                        if (customFieldValue?.field_type === 'boolean') {
                                        displayValue = parseInt(displayValue) === 1 ? <div className='w-4 h-4 bg-green-400 rounded-full animate-pulse'></div>
                                         :
                                        <div className='w-4 h-4 bg-red-400 rounded-full animate-pulse'></div>;
                                        }

                                        return (
                                        <td className="hidden sm:table-cell py-2 px-6 " key={index}>
                                            {displayValue}
                                        </td>
                                        );
                                    } else {
                                        return <td className="py-2 px-6" key={index}></td>; // Empty cell
                                    }
                                    })}
                                        
                                    
                                    <td className="hidden sm:table-cell py-2 px-6">
                                        <EditModal customer={customer} onClose={() => {/* As mentioned, potential additional operations after closing */}}/>
                                    </td>
                                    <td className="hidden sm:table-cell py-2 px-6">
                                        <PrimaryButton onClick={() => Delete(customer.id)}>
                                            <FaTrash />
                                        </PrimaryButton>
                                    </td>
                                    <td className="hidden sm:table-cell py-2 px-6">
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

                                    <td>
                                    <div className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
                                                    <AddProductModal customerId={customer.id} />
                                                </div>
                                    </td>
                                    

                                </tr>
                            ))}

                        </tbody>
                    </table>
                            
                    </div>
                    {auth.customers.links && (
                        <div className="mt-4 flex justify-end">
                            <PaginationComponent links={auth.customers.links} />
                        </div>
                    )}
                    
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center h-full text-[30px] font-semibold text-gray-600 dark:text-gray-300'>
                        {userPermissions.find(perm => perm.name === 'create customer' && perm.hasPermission) && (
                        <div>
                            <p>Add a new Customer</p>
                            <span className='animate-pulse flex justify-center'><CreateModal /></span>
                        </div>        
                    )} 
                </div>   
            )}

        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className='w-[550px] h-[450px] overflow-auto p-4'>
                <h2 className="text-lg font-bold mb-4">Customer Details</h2>
                <div>
                    <div><strong>Name:</strong> {selectedCustomer?.name}</div>
                    <div><strong>Email:</strong> {selectedCustomer?.email}</div>
                    <div><strong>Phone Number:</strong> {selectedCustomer?.phone_number}</div>

                    <h3 className="text-md font-semibold mt-3">Custom Fields:</h3>
                    {selectedCustomer?.custom_fields_values?.map((field, index) => (
                        <div key={index}>
                            <strong>{field.custom_field.field_name}:</strong> {field.value}
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
        </MainLayout>
    );
};

export default Show;
