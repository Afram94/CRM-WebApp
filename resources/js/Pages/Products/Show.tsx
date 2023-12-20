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
import ProductChannelsHandler from './ProductChannelsHandler';

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

    /**
       * This function is called when a new customer is created.
       * It updates the state to include the new customer at the beginning of the list.
       * Because the UI displays a maximum of 5 customers per page (due to pagination),
       * we need to ensure that adding a new customer doesn't increase the count beyond 20.
       * If it does, we slice the array to remove the last customer,
       * effectively maintaining the correct number of customers on the current page.
       * This approach resolves an issue where the list displayed 21 customers after
       * a new customer was created until the page was refreshed.
       *
       * @param {Product} newProduct - The new customer to be added to the list.
       */
        const handleNewProduct = (newProduct: Product) => {
            // Log to console whenever this function is triggered
            console.log("New product event triggered");

            // Update state with a function to ensure we have the most current state
            setFilteredProducts((prevProducts) => {
            // Check if the new customer object has an ID property
            if (newProduct.id) {
                // If it does, add the new customer to the start of the customer array
                const updatedProducts = [newProduct, ...prevProducts];

                // After adding the new customer, check if we have more than 20 customers
                if (updatedProducts.length > 20) {
                // If we do, return only the first 20 customers to stay within page limits
                return updatedProducts.slice(0, 20);
                }

                // If we have 20 or fewer customers, return the updated list as is
                return updatedProducts;
            } else {
                // If the new customer object lacks an ID, log an error for debugging
                console.error('New product is missing an ID:', newProduct);
                // Return the previous customer array unchanged
                return prevProducts;
            }
            });
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

    /* console.log(distinctCustomFieldNames); */

    return (
        <MainLayout title='Products'>
            <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search products..."
            />
            <CreateProductsModal />

            <ProductChannelsHandler
                userId={auth.user?.id ?? null}
                parentId={auth.user?.user_id ?? null}
                onNewProduct={handleNewProduct}
                /* onUpdateProduct={()=>{}}
                onDeleteProduct={()=>{}} */
            />
            
            {/* <ProductCustomFieldForm /> */}
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
