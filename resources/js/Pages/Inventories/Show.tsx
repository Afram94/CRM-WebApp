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

const InventoriesIndex: React.FC<PageProps> = ({ auth }) => {
    const [filteredInventories, setFilteredInventories] = useState<Inventory[]>(auth.inventories || []);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFilteredInventories = async () => {
        try {
            const response = await axios.get(`/inventories?search=${searchTerm}`);
            if (response.data && response.data.auth && response.data.auth.inventories) {
                setFilteredInventories(response.data.auth.inventories);
            }
        } catch (error) {
            console.error('Failed to fetch filtered inventories:', error);
        }
    };

    useEffect(() => {
        if (searchTerm.length >= 3 || searchTerm === '') {
            fetchFilteredInventories();
        }
    }, [searchTerm]);

    const handleReset = () => {
        setSearchTerm('');
    };

    useEffect(() => {
        if (auth.inventories) {
            setFilteredInventories(auth.inventories);
        }
    }, [auth.inventories]);

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
        const handleNewInventory = (newInventory: Inventory) => {
            setFilteredInventories(prevInventories => {
                // Check if the new inventory already exists in the current state
                const isExistingInventory = prevInventories.some(inventory => inventory.id === newInventory.id);

                // Add the new inventory to the state only if it doesn't exist already
                if (!isExistingInventory) {
                    // Prepend the new inventory to the start of the inventory array
                    const updatedInventories = [newInventory, ...prevInventories];

                    // Maintain a maximum of 20 inventories for display, adjusting as needed
                    return updatedInventories.slice(0, 20);
                }

                // Return the previous state if the inventory already exists
                return prevInventories;
            });
        };

    return (
        <MainLayout title='Inventories'>
            <div className='bg-white dark:bg-gray-800 p-4 rounded-xl'>
            <InventoryChannelsHandler
              userId={auth.user?.id ?? null}
              parentId={auth.user?.user_id ?? null}
              onNewInventory={handleNewInventory}
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
        </MainLayout>
    );
};

export default InventoriesIndex;
