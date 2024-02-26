import React, { useEffect, useState } from 'react';
import { Customer, PageProps, Product } from '@/types';
import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import CreateProductsModal from './Components/CreateProductsModal';
import EditProductModal from './Components/EditProductModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaMinus, FaPlus, FaShoppingCart, FaTrashRestore } from 'react-icons/fa';
import axios from 'axios';
import ProductCustomFieldForm from './ProductCustomFieldForm';
import ProductChannelsHandler from './ProductChannelsHandler';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import PaginationComponent from '@/Components/Pagination';
import Modal from '@/Components/Modal';
import { MdAttachMoney } from 'react-icons/md';
import { IoCart } from 'react-icons/io5';

type GroupedProducts = {
    [category: string]: Product[];
};

const ProductsIndex: React.FC<PageProps> = ({ auth }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(auth.products.data || []);
    const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});
    const [openCategories, setOpenCategories] = useState<string[]>([]);


    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    /* const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : {};
    }); */

    // Define the cart state with an explicit type
    const [cart, setCart] = useState<Record<number, number>>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : {};
    });
  

    // Handle adding to cart
    const addToCart = (productId : number) => {
        setCart((prevCart : any) => {
            const newCart = { ...prevCart, [productId]: (prevCart[productId] || 0) + 1 };
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    // Handle removing from cart
    const removeFromCart = (productId : number) => {
    setCart((prevCart : any) => {
            const newCart = { ...prevCart };
            if (!newCart[productId]) return prevCart;

            if (newCart[productId] === 1) {
                delete newCart[productId];
            } else {
                newCart[productId] -= 1;
            }

            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });
    };

    const toggleCartModal = () => {
        setIsCartModalOpen(!isCartModalOpen);
    };

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

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredProducts(auth.products.data);
            return;
        }

    if (searchTerm.length >= 3) {

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

        fetchFilteredProducts();

    } else {
        setFilteredProducts(auth.products.data);
    }
    }, [searchTerm, auth.products.data]);


    /* // Fetch products when search term changes
    useEffect(() => {
        if (searchTerm.length >= 3 || searchTerm === '') {
            fetchFilteredProducts();
        }
    }, [searchTerm]); */

    

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

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    useEffect(() => {
        axios.get('/get-customers') // Adjust the API endpoint as needed
          .then(response => {
            setCustomers(response.data);
            /* setSelectedProduct(response.data[0]); // Default to the first product, adjust as needed */

        })
        .catch(error => console.error('Error fetching products:', error));
    }, []);
    console.log(customers);


    const handleCheckout = async () => {
        // Assuming selectedCustomer is a state that holds the currently selected customer ID
        if (!selectedCustomer) {
            alert("Please select a customer");
            return;
        }
    
        const productsArray = Object.keys(cart).map((productId : any) => ({
            id: parseInt(productId, 10),
            quantity: cart[productId],
        }));
    
        try {
            const response = await axios.post('/orders', { // Ensure the URL matches your API endpoint
                customer_id: selectedCustomer,
                products: productsArray,
            });
    
            localStorage.removeItem('cart');
            setCart({});
            setIsCartModalOpen(false); // Close the cart modal
            alert('Order created successfully');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create the order');
        }
    };

    /* console.log(distinctCustomFieldNames);
    console.log(filteredProducts);
    console.log(auth.products); */
    
    return (
        <MainLayout title="Products / All Products">
            <div className="bg-white dark:bg-gray-800 bg-opacity-75 p-4 rounded-xl">
                <div className="w-full flex justify-between my-4">
                    <div className="flex gap-2">
                        <TextInput
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search..."
                            className="flex gap-2"
                        />
                        <DangerButton onClick={handleReset}>Reset</DangerButton>
                    </div>

                    <div className="flex items-center gap-12">
                        <button onClick={toggleCartModal} className="relative flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg cursor-pointer">
                            <FaShoppingCart className="w-6 h-6" />
                            {Object.keys(cart).length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{ (Object.values(cart) as number[]).reduce((acc: number, curr: number) => acc + curr, 0) }</span>
                            )}
                        </button>
                        <CreateProductsModal />
                    </div>

                    <ProductChannelsHandler
                        userId={auth.user?.id ?? null}
                        parentId={auth.user?.user_id ?? null}
                        onNewProduct={handleNewProduct}
                        onUpdateProduct={handleUpdatedProduct}
                        onDeleteProduct={handleDeleteProduct}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="bg-slate-200 dark:bg-gray-700 rounded-lg shadow-lg p-4 flex flex-col justify-between">
                            <div className='flex justify-between'>
                                <div>
                                    <h3 className="text-lg font-semibold dark:text-slate-300">{product.name}</h3>
                                    <p className="dark:text-slate-400 text-sm my-2">{product.description}</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <EditProductModal product={product} onClose={() => {/* Handle close */}} />
                                    <PrimaryButton onClick={() => handleDeleteProduct(product.id)}>
                                        <FaTrashRestore />
                                    </PrimaryButton>
                                </div>
                            </div>

                            {/* <div className='flex flex-row justify-between'>
                                <p className="dark:text-slate-300 font-medium flex flex-col">Category: <span className="font-normal">{product.category_name || 'N/A'}</span></p>
                                <p className="dark:text-slate-300 font-medium flex flex-col">Price: <span className="font-normal">${product.price}</span></p>
                            </div> */}

                            <div className='flex flex-col sm:flex-row justify-center sm:gap-10 text-gray-700 dark:text-gray-100 my-4'>
                                <div className='flex items-center justify-center my-2'>
                                    <IoCart className="w-10 h-10 text-indigo-500 bg-indigo-200 rounded-md p-2"/>
                                    <div className='mx-2'>
                                        <p className='font-semibold dark:text-slate-300'>Category:</p>
                                        <p className='dark:text-slate-300'>{product.category_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className='flex items-center justify-center my-2'>
                                    <MdAttachMoney className="w-10 h-10 text-indigo-500 bg-indigo-200 rounded-md p-2" />
                                    <div className='mx-2'>
                                    <p className='font-semibold dark:text-slate-300'>Price:</p>
                                    <p className='dark:text-slate-300'>${product.price}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-4 mx-8">
                                    <PrimaryButton className='border-2 border-slate-300 py-3 px-4 rounded-2xl dark:bg-gray-800 bg-slate-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors dark:text-slate-300' onClick={() => removeFromCart(product.id)}><FaMinus /></PrimaryButton>
                                    <span className='dark:text-slate-300 text-xl'>{cart[product.id] || 0}</span>
                                    <PrimaryButton className='border-2 border-slate-300 py-3 px-4 rounded-2xl dark:bg-gray-800 bg-slate-400 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors dark:text-slate-300' onClick={() => addToCart(product.id)}><FaPlus /></PrimaryButton>
                                </div>

                                {/* <div className="flex justify-between">
                                    <EditProductModal product={product} onClose={() => {}} />
                                    <PrimaryButton onClick={() => handleDeleteProduct(product.id)}>
                                        <FaTrashRestore />
                                    </PrimaryButton>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>

                {auth.products.links && (
                        <div className="mt-4 flex justify-end">
                            <PaginationComponent links={auth.products.links} />
                        </div>
                    )}
            </div>
            
            <Modal show={isCartModalOpen} onClose={toggleCartModal} maxWidth="md">
                <div className="p-4">
                    <h2 className="font-bold text-lg mb-4">Cart Items</h2>
                    <ul>
                        {Object.entries(cart).map(([productId, quantity]) => {
                            const product = filteredProducts.find(p => p.id === Number(productId));
                            return (
                                <li key={productId} className="mb-2">
                                    {product?.name} - Quantity: {quantity as number}
                                </li>
                            );
                        })}
                    </ul>
                    <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                        <option value="">Select a Customer</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>
                    <button onClick={handleCheckout}>Checkout</button>
                </div>
            </Modal>
        </MainLayout>
    );
};

export default ProductsIndex;
