import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import { successToast } from '@/Components/toastUtils';

type Product = {
    id: number;
    name: string;
};

type SelectProductProps = {
    customerId: number;
    closeModal: () => void;
};

const SelectProduct: React.FC<SelectProductProps> = ({ customerId, closeModal }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>('');

    useEffect(() => {
        axios.get('/get-products') // Adjust API endpoint as needed
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const handleAddProduct = async () => {
        try {
            await axios.post(`/customers/${customerId}/addProduct`, { product_id: selectedProductId });
            successToast('Product added to customer successfully');
            closeModal();
        } catch (error) {
            console.error('Error adding product to customer:', error);
        }
    };

    return (
        <>
            <select
                value={selectedProductId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProductId(e.target.value)}
            >
                <option value="">Select a Product</option>
                {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                ))}
            </select>
            <div className='mt-3 flex justify-end'>
                <PrimaryButton onClick={handleAddProduct}>Add Product</PrimaryButton>
            </div>
        </>
    );
};

export default SelectProduct;
