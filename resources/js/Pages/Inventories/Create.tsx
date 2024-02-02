import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Product } from '@/types';

type CreateInventoryProps = {
    closeModal: () => void;
};

const CreateInventory: React.FC<CreateInventoryProps> = ({ closeModal }) => {
    const [productId, setProductId] = useState<number>();
    const [quantity, setQuantity] = useState<number>();
    const [stockStatus, setStockStatus] = useState<string>('');
    const [restockDate, setRestockDate] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    // Placeholder for future custom fields
    const [customFields, setCustomFields] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/get-products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
        // Fetch custom fields when implemented
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await axios.post("/inventories", {
                product_id: productId,
                quantity,
                stock_status: stockStatus,
                restock_date: restockDate,
                // Include custom fields when implemented
            });
            closeModal();
        } catch (error) {
            console.error('Error creating inventory:', error);
        }
    };

    return (
        <>
            <div className='grid grid-cols-2 gap-2'>
                <select 
                    value={productId}
                    onChange={(e) => setProductId(Number(e.target.value))}
                    className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm col-span-2'
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
                {/* Placeholder for future custom fields */}
                {customFields.map((field, index) => (
                    <div key={index}>
                        {/* Custom field implementation here */}
                    </div>
                ))}
            </div>
            <div className='mt-3 flex justify-end'>
                <PrimaryButton onClick={handleSubmit}>Create Inventory</PrimaryButton>
            </div>
        </>
    );
};

export default CreateInventory;
