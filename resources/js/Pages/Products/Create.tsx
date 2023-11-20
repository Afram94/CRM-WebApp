import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

const CreateProduct: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [sku, setSku] = useState<string>("");
    const [inventoryCount, setInventoryCount] = useState<string>("");

    const addProduct = async () => {
        try {
            const response = await axios.post('/products', {
                name,
                description,
                price,
                sku,
                inventory_count: inventoryCount,
            });
            console.log('Product added:', response.data);
            // Handle post-creation logic (like redirecting or updating a list)
        } catch (error) {
            console.log('Failed to add product:', error);
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
            </div>
            <PrimaryButton className='mt-2' onClick={addProduct}>Add Product</PrimaryButton>
        </>
    );
};

export default CreateProduct;
