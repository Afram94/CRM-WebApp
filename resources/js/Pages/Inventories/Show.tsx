import React, { useEffect, useState } from 'react';
import { PageProps, Inventory } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateInventoriesModal from './Components/CreateInventoriesModal';
import EditInventoriesModal from './Components/EditInventoriesModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import InventoryChannelsHandler from './InventoryChannelsHandler';
import PaginationComponent from '@/Components/Pagination';

const Show: React.FC<PageProps> = ({ auth }) => {
    const [filteredInventories, setFilteredInventories] = useState<Inventory[]>(auth.inventories.data || []);
    const [searchTerm, setSearchTerm] = useState('');

    /* const fetchFilteredInventories = async () => {
        try {
            const response = await axios.get(`/inventories?search=${searchTerm}`);
            if (response.data && response.data.auth && response.data.auth.inventories) {
                setFilteredInventories(response.data.auth.inventories.data);
            }
        } catch (error) {
            console.error('Failed to fetch filtered inventories:', error);
        }
    };

    useEffect(() => {
        if (searchTerm.length >= 3 || searchTerm === '') {
            fetchFilteredInventories();
        }
    }, [searchTerm]); */

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredInventories(auth.inventories.data);
            return;
        }

    if (searchTerm.length >= 3) {

        // Fetch filtered inventories based on search term
        const fetchFilteredInventories = async () => {
            try {
                const response = await axios.get(`/inventories?search=${searchTerm}`);
                if (response.data && response.data.auth && response.data.auth.inventories) {
                    setFilteredInventories(response.data.auth.inventories.data);
                }
            } catch (error) {
                console.error('Failed to fetch filtered inventories:', error);
            }
        };

        fetchFilteredInventories();

    } else {
        setFilteredInventories(auth.inventories.data);
    }
    }, [searchTerm, auth.inventories.data]);

    const handleReset = () => {
        setSearchTerm('');
    };

    /* useEffect(() => {
        if (auth.inventories) {
            setFilteredInventories(auth.inventories.data);
        }
    }, [auth.inventories]); */

    const deleteInventory = async (inventoryId: number) => {
        try {
            const response = await axios.delete(`/inventories/${inventoryId}`);
            // Update UI or redirect as needed
        } catch (error) {
            console.error('Error deleting inventory', error);
        }
    };


    /**
         * This function is called when a new inventory is created.
         * It updates the state to include the new inventory at the beginning of the list.
         * Because the UI displays a maximum of 5 inventories per page (due to pagination),
         * we need to ensure that adding a new inventory doesn't increase the count beyond 20.
         * If it does, we slice the array to remove the last inventory,
         * effectively maintaining the correct number of inventories on the current page.
         * This approach resolves an issue where the list displayed 21 inventories after
         * a new inventory was created until the page was refreshed.
         *
         * @param {Inventory} newInventory - The new inventory to be added to the list.
         */

            const handleNewInventory = (newInventory : Inventory) => {
                console.log("New product event triggered");
            
                setFilteredInventories((prevInventories) => {
                    // Check if the new product already exists in the current state
                    const isExistingProduct = prevInventories.some(product => product.id === newInventory.id);
            
                    if (!isExistingProduct) {
                        // Explicitly handle the product name for the new product
                        // Assuming newInventory includes a product object with its name
                        // If newInventory does not include this directly, adjust according to how you receive the product information
                        let productToAdd = {
                            ...newInventory,
                            product_name: newInventory.product ? newInventory.product.name : 'Uncategorized', // Adjust if your data structure differs
                        };
            
                        // Prepend the new product to the start of the product array
                        const updatedProducts = [productToAdd, ...prevInventories];
            
                        // Maintain a maximum of 20 products for display, adjusting as needed
                        return updatedProducts.slice(0, 20);
                    }
            
                    // Return the previous state if the product already exists
                    return prevInventories;
                });
            };

        /* const handleNewInventory = (newInventory: Inventory) => {
            console.log("handleNewNote Work!!")
            setFilteredInventories((prevInventories) => {
              if (newInventory?.id) {  // Ensure the new note has a user name
                return [...prevInventories, newInventory];
              } else {
                // Handle this case, e.g., provide a default name or fetch additional data
                console.error('New note does not have a user_name:', newInventory);
                return prevInventories;  // For now, keep the old notes as they were
              }
            });
          }; */


          const handleUpdateInventory = (updatedInventory: Inventory) => {
            console.log("Updated product event triggered");
        
            setFilteredInventories((prevInventories) => {
                return prevInventories.map(inventory => {
                    if (inventory.id === updatedInventory.id) {
                        // If the updated inventory item is found, merge the updates
                        // Assuming updatedInventory includes a product object with its name
                        // If updatedInventory does not include this directly, adjust according to how you receive the product information
                        const updatedProduct = {
                            ...inventory,
                            ...updatedInventory,
                            product_name: updatedInventory.product ? updatedInventory.product.name : inventory.product_name || 'Uncategorized', // Fallback to previous or 'Uncategorized'
                        };
                        return updatedProduct;
                    }
                    return inventory; // Return unmodified for other items
                });
            });
        };
        

    return (
        <MainLayout title='Inventories'>
            <div className='bg-white dark:bg-gray-800 p-4 rounded-xl'>
            <InventoryChannelsHandler
              userId={auth.user?.id ?? null}
              parentId={auth.user?.user_id ?? null}
              onNewInventory={handleNewInventory}
              onUpdateInventory={handleUpdateInventory}
            />
                <div className='w-full flex justify-between my-4'>
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
                    <CreateInventoriesModal />
                </div>

                <div className='overflow-x-auto'>
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal border-y-2">
                                <th className="py-2 px-6 text-left">Product Name</th>
                                <th className="py-2 px-6 text-left">Quantity</th>
                                <th className="py-2 px-6 text-left">Stock Status</th>
                                <th className="py-2 px-6 text-left">Restock Date</th>
                                <th className="py-2 px-6">Edit</th>
                                <th className="py-2 px-6">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
                            {filteredInventories.map((inventory) => (
                                <tr key={inventory.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="py-2 px-6">{inventory.product_name}</td>
                                    <td className="py-2 px-6">{inventory.quantity}</td>
                                    <td className="py-2 px-6">{inventory.stock_status}</td>
                                    <td className="py-2 px-6">{inventory.restock_date ?? 'N/A'}</td>
                                    <td className="py-2 px-6">
                                        <EditInventoriesModal inventory={inventory} onClose={() => {/* Operations after closing modal */}} />
                                    </td>
                                    <td className="py-2 px-6">
                                        <PrimaryButton onClick={() => deleteInventory(inventory.id)}>
                                            <FaTrashRestore />
                                        </PrimaryButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {auth.inventories.links && (
                        <div className="mt-4 flex justify-end">
                            <PaginationComponent links={auth.inventories.links} />
                        </div>
                    )}
        </MainLayout>
    );
};

export default Show;
