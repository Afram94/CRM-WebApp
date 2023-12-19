import React, { useEffect, useState } from 'react';
import { PageProps, Product, Category } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateCategoriesModal from './Components/CreateCategoriesModal';
import EditCategoryModal from './Components/EditCategoryModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';

const CategoryIndex: React.FC<PageProps> = ({ auth }) => {

    console.log(auth.categories);

    const [filteredCategories, setFilteredCategories] = useState<Category[]>(auth.categories || []);

    /* const handleNewProduct = (newProduct: Product) => {
        console.log("handleNewNote Work!!")
        setFilteredCategories((prevNotes) => {
          if (newProduct.id) {  // Ensure the new note has a user name
            return [...prevNotes, newProduct];
          } else {
            // Handle this case, e.g., provide a default name or fetch additional data
            console.error('New note does not have a user_name:', newProduct);
            return prevNotes;  // For now, keep the old notes as they were
          }
        });
      }; */

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

      useEffect(() => {
        // Check if auth.products is not null or undefined
        if (auth.categories) {
            setFilteredCategories(auth.categories);
        }
    }, [auth.categories]); // Dependency array to re-run this effect if auth.products changes
    
      

    return (
        <MainLayout title='categories'>
            <CreateCategoriesModal/>
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
