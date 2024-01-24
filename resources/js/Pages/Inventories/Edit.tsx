import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Inventory } from '@/types';

interface EditProps {
    inventory: Inventory;
    closeModal: () => void;
}

const Edit: React.FC<EditProps> = ({ inventory, closeModal }) => {
    const [quantity, setQuantity] = useState(inventory.quantity || 0); // Default to 0 if undefined
    const [stockStatus, setStockStatus] = useState(inventory.stock_status || '');
    const [minStockLevel, setMinStockLevel] = useState(inventory.min_stock_level || 0);
    const [maxStockLevel, setMaxStockLevel] = useState(inventory.max_stock_level || 0);
    const [restockDate, setRestockDate] = useState(inventory.restock_date || '');

    const updateInventory = async () => {
        try {
            const payload = {
                quantity,
                stock_status: stockStatus,
                min_stock_level: minStockLevel,
                max_stock_level: maxStockLevel,
                restock_date: restockDate,
            };
            const response = await axios.put(`/inventories/${inventory.id}`, payload);
            console.log('Inventory updated:', response.data);
            closeModal();
        } catch (error) {
            console.error('Failed to update inventory:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateInventory();
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextInput 
                value={quantity.toString()} 
                onChange={e => setQuantity(Number(e.target.value))} 
            />
            <TextInput 
                value={stockStatus} 
                onChange={e => setStockStatus(e.target.value)} 
            />
            <TextInput 
                value={minStockLevel.toString()} 
                onChange={e => setMinStockLevel(Number(e.target.value))} 
            />
            <TextInput 
                value={maxStockLevel.toString()} 
                onChange={e => setMaxStockLevel(Number(e.target.value))} 
            />
            <TextInput 
                value={restockDate || ''} 
                onChange={e => setRestockDate(e.target.value)} 
            />
            <PrimaryButton type="submit">Update Inventory</PrimaryButton>
        </form>
    );
};

export default Edit;
