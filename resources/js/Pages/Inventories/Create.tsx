import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Product } from '@/types';

type CreateInventoryProps = {
    closeModal: () => void;
};

const Create: React.FC<CreateInventoryProps> = ({ closeModal }) => {
    /* const [userId, setUserId] = useState<number>(0); */
    const [productId, setProductId] = useState<number>();
    const [quantity, setQuantity] = useState<number>();
    const [stockStatus, setStockStatus] = useState<string>('');
    const [restockDate, setRestockDate] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/get-products');
                console.log(response.data); // Log to inspect the structure
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                // Handle error
            }
        };

        fetchProducts();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await axios.post("/inventories", {
                /* user_id: userId, */
                product_id: productId,
                quantity,
                stock_status: stockStatus,
                restock_date: restockDate,
            });
            console.log('Inventory Created:', response.data);
            closeModal();
        } catch (error) {
            console.log('Error Creating inventory:', error);
        }
    };

    return (
        <div>
            {/* Dropdown for selecting product */}
            <select 
                value={productId}
                onChange={(e) => setProductId(Number(e.target.value))}
                className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
            >
                <option value="">Select a Product</option>
                {products.map((product) => (
                    <option key={product.id} value={product.id}>
                        {product.name}
                    </option>
                ))}
            </select>
            <TextInput 
                type="number" 
                placeholder="Quantity" 
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <TextInput 
                type="text" 
                placeholder="Stock Status" 
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value)}
            />
            <TextInput 
                type="date" 
                placeholder="Restock Date" 
                value={restockDate}
                onChange={(e) => setRestockDate(e.target.value)}
            />
            <PrimaryButton onClick={handleSubmit}>Create Inventory</PrimaryButton>
        </div>
    )
};

export default Create;
