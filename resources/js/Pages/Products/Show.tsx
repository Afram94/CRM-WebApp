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
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import PaginationComponent from '@/Components/Pagination';

type GroupedProducts = {
    [category: string]: Product[];
};

const ProductsIndex: React.FC<PageProps> = ({ auth }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(auth.products.data || []);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
    const [openCategories, setOpenCategories] = useState<string[]>([]);

    // Function to group products by category
   /*  const groupProducts = (products: Product[]) => {
        const initialGroup: GroupedProducts = {};
        return products.reduce((acc, product) => {
            const categoryName = product.category_name || 'Uncategorized';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(product);
            return acc;
        }, initialGroup);
    }; */

    // Group products when filteredProducts changes
    /* useEffect(() => {
        setGroupedProducts(groupProducts(filteredProducts));
    }, [filteredProducts]); */

    /* const toggleAccordion = (categoryName: string) => {
        setOpenCategories(prev => 
            prev.includes(categoryName) 
                ? prev.filter(name => name !== categoryName) 
                : [...prev, categoryName]
        );
    }; */

    /* const isAccordionOpen = (categoryName: string): boolean => {
        return openCategories.includes(categoryName);
    }; */

    // Fetch filtered products based on search term
    const fetchFilteredProducts = async () => {
        try {
            const response = await axios.get(`/products?search=${searchTerm}`);
            if (response.data && response.data.auth && response.data.auth.products) {
                setFilteredProducts(response.data.auth.products.data);
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

    const handleReset = () => {
        setSearchTerm('');   
    }

        /**
         * This function is called when a new product is created.
         * It updates the state to include the new product at the beginning of the list.
         * Because the UI displays a maximum of 5 products per page (due to pagination),
         * we need to ensure that adding a new product doesn't increase the count beyond 20.
         * If it does, we slice the array to remove the last product,
         * effectively maintaining the correct number of products on the current page.
         * This approach resolves an issue where the list displayed 21 products after
         * a new product was created until the page was refreshed.
         *
         * @param {Product} newProduct - The new product received from the WebSocket event.
         */
        const handleNewProduct = (newProduct : Product) => {
            console.log("New product event triggered");
        
            setFilteredProducts((prevProducts) => {
                // Check if the new product already exists in the current state
                const isExistingProduct = prevProducts.some(product => product.id === newProduct.id);
        
                if (!isExistingProduct) {
                    // Explicitly handle the category name for the new product
                    // Assuming newProduct includes a category object with its name
                    // If newProduct does not include this directly, adjust according to how you receive the category information
                    let productToAdd = {
                        ...newProduct,
                        category_name: newProduct.category ? newProduct.category.name : 'Uncategorized', // Adjust if your data structure differs
                    };
        
                    // Prepend the new product to the start of the product array
                    const updatedProducts = [productToAdd, ...prevProducts];
        
                    // Maintain a maximum of 20 products for display, adjusting as needed
                    return updatedProducts.slice(0, 20);
                }
        
                // Return the previous state if the product already exists
                return prevProducts;
            });
        };
        
    

        const handleUpdatedProduct = (updatedProduct : Product) => {
            console.log("Updated product event triggered");
        
            setFilteredProducts((prevProducts) => {
                return prevProducts.map(product => {
                    if (product.id === updatedProduct.id) {
                        // If the updated category name is nested, adjust accordingly
                        const updatedCategoryName = updatedProduct.category ? updatedProduct.category.name : product.category_name;
                        return { ...product, ...updatedProduct, category_name: updatedCategoryName };
                    }
                    return product;
                });
            });
        };

        const handleDeleteProduct = (deletedProductId: number) => {
            console.log("handleDeleteNote Work!!", deletedProductId);
            setFilteredProducts((prevProducts) => prevProducts.filter(product => product.id !== deletedProductId));
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

    /* console.log(distinctCustomFieldNames);
    console.log(filteredProducts);
    console.log(auth.products); */
    
    return (
        <MainLayout title='Products / All Products'>
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
                        <CreateProductsModal />

                        <ProductChannelsHandler
                            userId={auth.user?.id ?? null}
                            parentId={auth.user?.user_id ?? null}
                            onNewProduct={handleNewProduct}
                            onUpdateProduct={handleUpdatedProduct}
                            onDeleteProduct={handleDeleteProduct}
                        />
                </div>
                        {/* <ProductCustomFieldForm /> */}
                <div className='overflow-x-auto'>
                    <table className="min-w-full table-auto">
                    <thead>
                        <tr className="text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal border-y-2">
                            <th className="py-2 px-6 text-left">Product</th>
                            <th className="py-2 px-6 text-left">Category Name</th>
                            <th className="hidden sm:table-cell py-2 px-6">Description</th>
                            <th className="hidden sm:table-cell py-2 px-6">Price</th>
                            <th className="hidden sm:table-cell py-2 px-6">SKU</th>
                            {distinctCustomFieldNames.map(name => (
                                <th className="hidden sm:table-cell py-2 px-6 whitespace-nowrap" key={name}>{name}</th>
                            ))}
                            <th className="hidden sm:table-cell py-2 px-6">Edit</th>
                            <th className="hidden sm:table-cell py-2 px-6">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="py-2 px-6">
                                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                                </td>
                                <td className="hidden sm:table-cell py-2 px-6">{product.category_name}</td>
                                <td className="hidden sm:table-cell py-2 px-6">{product.description}</td>
                                <td className="hidden sm:table-cell py-2 px-6">{product.price}</td>
                                <td className="hidden sm:table-cell py-2 px-6">{product.sku}</td>
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
                {auth.products.links && (
                        <div className="mt-4 flex justify-end">
                            <PaginationComponent links={auth.products.links} />
                        </div>
                    )}
            </div>
        </MainLayout>
    );
};

export default ProductsIndex;
