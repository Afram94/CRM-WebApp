import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

const CreateCategory: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const addCategory = async () => {
        try {
            const response = await axios.post('/categories', {
                name,
                description,
            });
            console.log('Category added:', response.data);
            // Handle post-creation logic (like redirecting or updating a list)
        } catch (error) {
            console.log('Failed to add Category:', error);
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
            </div>
            <PrimaryButton className='mt-2' onClick={addCategory}>Add Category</PrimaryButton>
        </>
    );
};

export default CreateCategory;
