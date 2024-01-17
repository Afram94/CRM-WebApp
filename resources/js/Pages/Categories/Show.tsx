import React, { useEffect, useState } from 'react';
import { PageProps, Product, Category } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateCategoriesModal from './Components/CreateCategoriesModal';
import EditCategoryModal from './Components/EditCategoryModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';

const CategoryIndex: React.FC<PageProps> = ({ auth }) => {

    /* console.log(auth.categories); */

    const [filteredCategories, setFilteredCategories] = useState<Category[]>(auth.categories || []);
    const [searchTerm, setSearchTerm] = useState('');
      

      useEffect(() => {
        if (searchTerm === '') {
            setFilteredCategories(auth.categories);
            return;
        }
    
        // Only search if searchTerm length is 3 or more
        if (searchTerm.length >= 3) {
            
            const fetchFilteredCategories = async () => {
                try {
                    const response = await axios.get(`/categories?search=${searchTerm}`);
                    if (response.data && response.data.auth && response.data.auth.categories) {
                        console.log("Debug: ", response.data.auth.categories);
                        setFilteredCategories(response.data.auth.categories);
                    }
                } catch (error) {
                    console.error('Failed to fetch filtered categories:', error);
                }
            };
    
            fetchFilteredCategories();
    
        } else {
            // If searchTerm is between 1 and 2 characters, reset to the original list
            setFilteredCategories(auth.categories);
        }
    }, [searchTerm, auth.categories]);


    const handleReset = () => {
        setSearchTerm('');
    };

      const deleteCategory = async (categoryId: number) => {
        try {
            const response = await axios.delete(`/categories/${categoryId}`);
            console.log(response.data);
            // Update UI or redirect as needed
        } catch (error) {
            console.error('Error deleting product', error);
            // Handle errors
        }
    };  

      /* useEffect(() => {
        // Check if auth.products is not null or undefined
        if (auth.categories) {
            setFilteredCategories(auth.categories);
        }
    }, [auth.categories]); // Dependency array to re-run this effect if auth.products changes */
    
      

    return (
        <MainLayout title='categories'>
            <CreateCategoriesModal/>
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
            </div>
        <div className="container mx-auto p-4">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Description</th>
                        {/* Add more headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories?.map(category => (
                        <tr key={category.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">
                                <Link href={`/products/${category.id}`} className="text-blue-600 hover:text-blue-800">
                                    {category.name}
                                </Link>
                            </td>
                            <td className="border border-gray-300 p-2">{category.description}</td>
                            <td>
                                <EditCategoryModal category={category} onClose={() => {/* Operations after closing modal */}} />
                            </td>
                            <td>
                                <PrimaryButton onClick={() => deleteCategory(category.id)}>
                                    <FaTrashRestore />
                                </PrimaryButton>
                            </td>
                            {/* Add more product details as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </MainLayout>
    );
};

export default CategoryIndex;
