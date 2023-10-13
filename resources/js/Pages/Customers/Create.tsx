import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Inertia } from '@inertiajs/inertia';
import { successToast } from '@/Components/toastUtils';

type FormData = {
    name: string;
    email: string;
    phone_number?: string;
};

type CreateCustomerProps = {
    closeModal: () => void;
}

const Create: React.FC<CreateCustomerProps> = ({ closeModal }) => {

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone_number: '' 
    });

    

    const handleSave = async () => {
        try {
            const response = await axios.post('/customers', formData);
            if (response.data) {
                console.log(response.data);
                closeModal();  // Close the modal regardless of success or error

                successToast('The Customer has been deleted');
                setTimeout(() => {
                    Inertia.reload({only: ['Show']}); // Delayed reload
                }, 1300); // Delay for 2 seconds. Adjust as needed
            }
        } catch (error) {
            console.error(error);
        } finally {
            // This exeuted no matter what happens
        }
    };


    return (
        <>
        <div className='grid grid-cols-2 gap-2'>
            <TextInput
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextInput
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextInput
                type="number"
                placeholder="Phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
            {/* ... other input fields ... */}
        </div>
            <div className='mt-3'>
                <PrimaryButton onClick={handleSave}>Create Customer</PrimaryButton>
            </div>
        </>
    );
};

export default Create;
