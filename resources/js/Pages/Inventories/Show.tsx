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

    return (
        <MainLayout title='Inventories'>
            <div className='bg-white dark:bg-gray-800 p-4 rounded-xl'>
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

                <div className=''>
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
                        <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light ">
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
