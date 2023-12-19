// UpdateCategory.tsx
import React, { useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Category } from '@/types'; // Define this type based on your category structure
import axios from 'axios';

type UpdateCategoryProps = {
    category: Category;
    closeModal: () => void;
};

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ category, closeModal }) => {
    const [data, setData] = useState({
        name: category.name,
        description: category.description || '', // Default to empty string if null
    });

    const [isLoading, setLoading] = useState<boolean>(false);

    const updateCategory = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`/categories/${category.id}`, data);
            closeModal();
            // Handle successful response
        } catch (error) {
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            </div>
            <PrimaryButton className='mt-2' onClick={updateCategory} disabled={isLoading}>Update Category</PrimaryButton>
        </>
    );
};

export default UpdateCategory;
