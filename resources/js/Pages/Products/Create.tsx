import React, { useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Category, PageProps } from '@/types';
import axios from 'axios';

const CreateProduct: React.FC<PageProps> = ({ auth }) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [sku, setSku] = useState<string>("");
    const [inventoryCount, setInventoryCount] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    console.log(auth);

    const addProduct = async () => {
        try {
            const response = await axios.post('/products', {
                name,
                description,
                price,
                sku,
                inventory_count: inventoryCount,
                category_id: selectedCategory, // Add category_id in the request
            });
            console.log('Product added:', response.data);
            // Handle post-creation logic (like redirecting or updating a list)
        } catch (error) {
            console.error('Failed to add product:', error);
            // Handle error (like showing an error message)
        }
    };

    return (
        <>
            <div className='grid grid-cols-1 gap-2'>
                <TextInput 
                    type="text" 
                    placeholder="Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextInput 
                    type="text" 
                    placeholder="Price" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <TextInput 
                    type="text" 
                    placeholder="SKU" 
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                />
                <TextInput 
                    type="text" 
                    placeholder="Inventory Count" 
                    value={inventoryCount}
                    onChange={(e) => setInventoryCount(e.target.value)}
                />

                <select
                    className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Select a Category</option>
                    {auth.categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <PrimaryButton className='mt-2' onClick={addProduct}>Add Product</PrimaryButton>
        </>
    );
};

export default CreateProduct;
