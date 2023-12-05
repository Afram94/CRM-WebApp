import React, { useEffect, useState } from 'react';
import { PageProps, Product } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateProductsModal from './Components/CreateProductsModal';
import EditProductModal from './Components/EditProductModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';
import ProductCustomFieldForm from './ProductCustomFieldForm';

type GroupedProducts = {
    [category: string]: Product[];
};

const ProductsIndex: React.FC<PageProps> = ({ auth }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(auth.products || []);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
    const [openCategories, setOpenCategories] = useState<string[]>([]);

    // Function to group products by category
    const groupProducts = (products: Product[]) => {
        const initialGroup: GroupedProducts = {};
        return products.reduce((acc, product) => {
            const categoryName = product.category_name || 'Uncategorized';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(product);
            return acc;
        }, initialGroup);
    };

    // Fetch filtered products based on search term
    const fetchFilteredProducts = async () => {
        try {
            const response = await axios.get(`/products?search=${searchTerm}`);
            if (response.data && response.data.auth && response.data.auth.products) {
                setFilteredProducts(response.data.auth.products);
            }
        } catch (error) {
            console.error('Failed to fetch filtered products:', error);
        }
    };

    // Fetch products when search term changes
    useEffect(() => {
        if (searchTerm.length >= 3 || searchTerm === '') {
            fetchFilteredProducts();
        }
    }, [searchTerm]);

    // Group products when filteredProducts changes
    useEffect(() => {
        setGroupedProducts(groupProducts(filteredProducts));
    }, [filteredProducts]);

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
            <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search products..."
            />
            <CreateProductsModal />
            
            <ProductCustomFieldForm />
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
