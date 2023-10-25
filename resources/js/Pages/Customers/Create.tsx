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
    [key: string]: string | undefined; // for dynamic keys
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

    const [customFields, setCustomFields] = useState<any[]>([]);  // Add this line

    // Fetch custom fields when component mounts
    useEffect(() => {
        axios.get('/custom-fields').then(response => {
            setCustomFields(response.data);
        });
    }, []);

    const handleSave = async () => {
        try {
            // First, create the customer
            const response = await axios.post('/customers', formData);
            if (response.data) {
                console.log(response.data);
                const customerId = response.data.id; // Assuming the server returns the customer object with an id
    
                // Then, save the custom fields for the customer
                const customFieldPayload = {
                    custom_fields: customFields.reduce(
                        (acc, field) => ({
                            ...acc,
                            [field.id]: formData[field.field_name]
                        }),
                        {}
                    )
                };
                await axios.post(`/customers/${customerId}/custom-fields`, customFieldPayload);
    
                // Close the modal and show toast
                closeModal();
                successToast('Customer successfully created');
                setTimeout(() => {
                    Inertia.reload({only: ['Show']});
                }, 1300);
            }
        } catch (error) {
            console.error(error);
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
            
            {/* Dynamic custom fields */}
            {customFields.map(field => (
                <TextInput
                    key={field.id}
                    type={field.field_type}
                    placeholder={field.field_name}
                    value={formData[field.field_name]}
                    onChange={e => setFormData({ ...formData, [field.field_name]: e.target.value })}
                />
            ))}
        </div>
        <div className='mt-3'>
            <PrimaryButton onClick={handleSave}>Create Customer</PrimaryButton>
        </div>
        </>
    );
};

export default Create;
