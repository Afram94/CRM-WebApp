import React, { useEffect, useState } from 'react';
import { PageProps, Category } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateCategoriesModal from './Components/CreateCategoriesModal';
import EditCategoryModal from './Components/EditCategoryModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import PaginationComponent from '@/Components/Pagination'; // If you have pagination

const CategoryIndex: React.FC<PageProps> = ({ auth }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState<Category[]>(auth.categories || []);

    useEffect(() => {
        const fetchFilteredCategories = async () => {
            try {
                const response = await axios.get(`/categories?search=${searchTerm}`);
                if (response.data && response.data.auth && response.data.auth.categories) {
                    setFilteredCategories(response.data.auth.categories);
                }
            } catch (error) {
                console.error('Failed to fetch filtered categories:', error);
                // Handle errors
            }
        };

        if (searchTerm.length >= 3 || searchTerm === '') {
            fetchFilteredCategories();
        }
    }, [searchTerm]);

    const handleReset = () => {
        setSearchTerm('');
    };

    const deleteCategory = async (categoryId: number) => {
        try {
            const response = await axios.delete(`/categories/${categoryId}`);
            // Update UI or redirect as needed
        } catch (error) {
            console.error('Error deleting category', error);
            // Handle errors
        }
    };

    return (
        <MainLayout title='Categories'>
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
                    <CreateCategoriesModal />
                </div>

                <div className='overflow-x-auto'>
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal border-y-2">
                                <th className="py-2 px-6 text-left">Name</th>
                                <th className="py-2 px-6 text-left">Description</th>
                                <th className="py-2 px-6">Edit</th>
                                <th className="py-2 px-6">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="py-2 px-6">
                                        <Link href={`/categories/${category.id}`}>{category.name}</Link>
                                    </td>
                                    <td className="py-2 px-6">{category.description}</td>
                                    <td className="py-2 px-6">
                                        <EditCategoryModal category={category} onClose={() => {/* Operations after closing modal */}} />
                                    </td>
                                    <td className="py-2 px-6">
                                        <PrimaryButton onClick={() => deleteCategory(category.id)}>
                                            <FaTrashRestore />
                                        </PrimaryButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* PaginationComponent, if needed */}
                {/* <PaginationComponent links={auth.categories.links} /> */}
            </div>
        </MainLayout>
    );
};

export default CategoryIndex;
