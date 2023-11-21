import React, { useEffect, useState } from 'react';
import { PageProps, Product, Category } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

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

      useEffect(() => {
        // Check if auth.products is not null or undefined
        if (auth.categories) {
            setFilteredCategories(auth.categories);
        }
    }, [auth.products]); // Dependency array to re-run this effect if auth.products changes
    
      

    return (
        <MainLayout title='categories'>
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
                    {filteredCategories?.map(product => (
                        <tr key={product.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">
                                <Link href={`/products/${product.id}`} className="text-blue-600 hover:text-blue-800">
                                    {product.name}
                                </Link>
                            </td>
                            <td className="border border-gray-300 p-2">{product.description}</td>
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
