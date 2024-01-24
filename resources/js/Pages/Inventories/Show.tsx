import React, { useEffect, useState } from 'react';
import { PageProps, Inventory } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateInventoriesModal from './Components/CreateInventoriesModal';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import EditInventoriesModal from './Components/EditInventoriesModal';

const InventoriesIndex: React.FC<PageProps> = ({ auth }) => {
    const [filteredInventories, setFilteredInventories] = useState<Inventory[]>(auth.inventories || []);

    const [searchTerm, setSearchTerm] = useState('');


    const fetchFilteredInventories = async () => {
        try {
            const response = await axios.get(`/inventories?search=${searchTerm}`);
            console.log(response.data);
            if (response.data && response.data.auth && response.data.auth.inventories) {
                setFilteredInventories(response.data.auth.inventories);
            }
        } catch (error) {
            console.error('Failed to fetch filtered inventories:', error);
        }
    };

    // Fetch inventories when search term changes
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

    /* console.log(filteredInventories); */

    return (
        <MainLayout title='Inventories'>
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
            <div className="container mx-auto p-4">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            {/* <th className="border border-gray-300 p-2">User ID</th> */}
                            <th className="border border-gray-300 p-2">Product Name</th>
                            <th className="border border-gray-300 p-2">Quantity</th>
                            <th className="border border-gray-300 p-2">Stock Status</th>
                            <th className="border border-gray-300 p-2">Restock Date</th>
                            {/* Add more headers as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventories?.map(inventory => (
                            <tr key={inventory.id} className="hover:bg-gray-100">
                                {/* <td className="border border-gray-300 p-2">{inventory.user_id}</td> */}
                                <td className="border border-gray-300 p-2">{inventory.product_name}</td>
                                <td className="border border-gray-300 p-2">{inventory.quantity}</td>
                                <td className="border border-gray-300 p-2">{inventory.stock_status}</td>
                                <td className="border border-gray-300 p-2">{inventory.restock_date ?? 'N/A'}</td>
                                <td className="py-2 px-6">
                                    <EditInventoriesModal inventory={inventory} onClose={() => {/* Operations after closing modal */}}/>
                                </td>
                                {/* Add more inventory details as needed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );
};

export default InventoriesIndex;
