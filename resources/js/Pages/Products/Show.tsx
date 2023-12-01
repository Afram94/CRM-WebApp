import React, { useEffect, useState } from 'react';
import { PageProps, Product } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateProductsModal from './Components/CreateProductsModal';
import EditProductModal from './Components/EditProductModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';


type GroupedProducts = {
    [category: string]: Product[];
  };

const ProductsIndex: React.FC<PageProps> = ({ auth }) => {

    /* console.log(auth.products); */

    /* const [filteredProducts, setFilteredProducts] = useState<Product[]>(auth.products || []);

    const handleNewProduct = (newProduct: Product) => {
        console.log("handleNewNote Work!!")
        setFilteredProducts((prevNotes) => {
          if (newProduct.id) {  // Ensure the new note has a user name
            return [...prevNotes, newProduct];
          } else {
            // Handle this case, e.g., provide a default name or fetch additional data
            console.error('New note does not have a user_name:', newProduct);
            return prevNotes;  // For now, keep the old notes as they were
          }
        });
      };

      useEffect(() => {
        // Check if auth.products is not null or undefined
        if (auth.products) {
            setFilteredProducts(auth.products);
        }
    }, [auth.products]); // Dependency array to re-run this effect if auth.products changes */
    
    const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
    const [openCategories, setOpenCategories] = useState<string[]>([]);

    useEffect(() => {
        if (auth.products) {
            const initialGroup: GroupedProducts = {};
            const groups = auth.products.reduce((acc, product) => {
                const categoryName = product.category_name || 'Uncategorized';
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(product);
                return acc;
            }, initialGroup);

            setGroupedProducts(groups);
        }
    }, [auth.products]);

    const toggleAccordion = (categoryName: string) => {
        setOpenCategories(prev => 
            prev.includes(categoryName) 
                ? prev.filter(name => name !== categoryName) 
                : [...prev, categoryName]
        );
    };

    const isAccordionOpen = (categoryName: string): boolean => {
        return openCategories.includes(categoryName);
    };

    const deleteProduct = async (productId: number) => {
        try {
            const response = await axios.delete(`/products/${productId}`);
            console.log(response.data);
            // Update UI or redirect as needed
        } catch (error) {
            console.error('Error deleting product', error);
            // Handle errors
        }
    };    
      

    return (
        <MainLayout title='Products'>
            <CreateProductsModal />
            <div className="grid grid-cols-2 gap-2 rounded-lg p-4">
                {Object.entries(groupedProducts).map(([categoryName, products]) => (
                    <div key={categoryName} className="mb-2">
                        <div onClick={() => toggleAccordion(categoryName)} className="cursor-pointer bg-gray-200 p-2 rounded">
                            <div className='flex justify-between'>
                                <p>{categoryName}</p>
                                <p>{products.length}</p>
                            </div>
                        </div>
                        <div className={`transition-height duration-500 ease-in-out overflow-hidden ${isAccordionOpen(categoryName) ? 'max-h-96' : 'max-h-0'}`}>
                            <ul className="list-disc list-inside bg-red-200 rounded-b-lg">
                                {products.map(product => (
                                    <li key={product.id} className="p-1">
                                        <Link href={`/products/${product.id}`} className="text-blue-600 hover:text-blue-800">
                                            {product.name}
                                        </Link>
                                        <EditProductModal product={product} onClose={() => {/* Operations after closing modal */}} />
                                        <PrimaryButton onClick={() => deleteProduct(product.id)}>
                                            <FaTrashRestore />
                                        </PrimaryButton>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
};

export default ProductsIndex;
