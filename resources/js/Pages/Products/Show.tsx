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

    const maxFields = Math.max(...filteredProducts.map(p => p.custom_fields_values?.length || 0));

      const distinctCustomFieldNames = [
        ...new Set(
            filteredProducts
                .flatMap(p => p.custom_fields_values || [])
                .filter(field => field.custom_field) // Filter out any undefined custom_field
                .map(field => field.custom_field.field_name)
        )
    ];

    console.log(distinctCustomFieldNames);

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
            <div className='overflow-x-auto'>
            <table className="min-w-full table-auto">
                <thead>
                    <tr className="text-gray-600 uppercase text-sm leading-normal border-y-2">
                        <th className="py-2 px-6 text-left">Product</th>
                        {distinctCustomFieldNames.map(name => (
                            <th className="hidden sm:table-cell py-2 px-6 whitespace-nowrap" key={name}>{name}</th>
                        ))}
                        <th className="hidden sm:table-cell py-2 px-6">Edit</th>
                        <th className="hidden sm:table-cell py-2 px-6">Delete</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-2 px-6">
                                <Link href={`/products/${product.id}`}>{product.name}</Link>
                            </td>
                            {Array.from({ length: maxFields }).map((_, index) => {
                                if (product.custom_fields_values && index < product.custom_fields_values.length) {
                                    const customFieldValue = product.custom_fields_values[index];
                                    let displayValue = customFieldValue.value;
                                    if (customFieldValue.custom_field.field_type === 'boolean') {
                                        displayValue = parseInt(displayValue) === 1 
                                            ? <div className='w-4 h-4 bg-green-400 rounded-full animate-pulse'></div>
                                            : <div className='w-4 h-4 bg-red-400 rounded-full animate-pulse'></div>;
                                    }
                                    return <td key={index} className="hidden sm:table-cell py-2 px-6">{displayValue}</td>;
                                } else {
                                    return <td key={index} className="hidden sm:table-cell py-2 px-6"></td>;
                                }
                            })}
                            

                            {/* Edit and delete buttons */}
                            <td className="py-2 px-6">
                                <EditProductModal product={product} onClose={() => {/* Operations after closing modal */}}/>
                            </td>
                            <td className="py-2 px-6">
                                <PrimaryButton onClick={() => deleteProduct(product.id)}>
                                    <FaTrashRestore />
                                </PrimaryButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </MainLayout>
    );
};

export default ProductsIndex;
