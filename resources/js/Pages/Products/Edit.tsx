// UpdateProduct.tsx
import React, { useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Product } from '@/types';
import axios from 'axios';

type UpdateProductProps = {
    product: Product;
    closeModal: () => void;
};

const Edit: React.FC<UpdateProductProps> = ({ product, closeModal }) => {
    const [data, setData] = useState({
        name: product.name,
        description: product.description,
        price: product.price.toString(), // Convert to string for input field
        sku: product.sku,
        category_id: product.category_id?.toString() // Convert to string if it exists
    });

    console.log(product);


    const [isLoading, setLoading] = useState<boolean>(false);

    const updateProduct = async () => {
        setLoading(true);
        try {
            const updatedData = {
                ...data,
                price: parseFloat(data.price), // Convert back to number
                category_id: data.category_id ? parseInt(data.category_id) : null // Convert back to number or null
            };
            const response = await axios.put(`/products/${product.id}`, updatedData);
            // ...
        } catch (error) {
            // ...
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <>
            <div className='grid grid-cols-1 gap-2'>
                <TextInput 
                    type="text" 
                    name="name"
                    placeholder="Name" 
                    value={data.name}
                    onChange={handleChange}
                />
                <textarea
                    className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    name="description"
                    placeholder="Description"
                    value={data.description}
                    onChange={handleChange}
                />
                <TextInput 
                    type="text" 
                    name="price"
                    placeholder="Price" 
                    value={data.price}
                    onChange={handleChange}
                />
                <TextInput 
                    type="text" 
                    name="sku"
                    placeholder="SKU" 
                    value={data.sku || ""} // Convert null to empty string
                    onChange={handleChange}
                />
                {/* Add category select input if needed */}
            </div>
            <PrimaryButton className='mt-2' onClick={updateProduct} disabled={isLoading}>Update Product</PrimaryButton>
        </>
    );
};

export default Edit;
