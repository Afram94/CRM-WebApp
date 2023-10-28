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

    console.log("customFields", customFields)

    // Define an asynchronous function named handleSave
    const handleSave = async () => {
        try {
            // Attempt to create a new customer using the form data
            // Make an HTTP POST request to the '/customers' endpoint
            const response = await axios.post('/customers', formData);

            // Check if the server responds with data
            if (response.data) {
                // Log the server's response data to the console
                console.log(response.data);

                // Extract the customer ID from the server's response
                // (Assuming the server returns a customer object with an 'id' property)
                const customerId = response.data.id;

                // Prepare the payload for custom fields
                const customFieldPayload = {
                    // Using reduce to transform the customFields array into an object
                    custom_fields: customFields.reduce(
                        (acc, field) => ({
                            ...acc, // Keep the existing key-value pairs
                            [field.id]: formData[field.field_name] // Add new key-value pairs
                        }),
                        {} // Initial value for the accumulator is an empty object
                    )
                };

                // Make an HTTP POST request to save the custom fields for the created customer
                await axios.post(`/customers/${customerId}/custom-fields`, customFieldPayload);
                console.log("customFieldPayload", customFieldPayload)
                // Close the modal after successful customer creation
                closeModal();

                // Display a toast message indicating successful customer creation
                successToast('Customer successfully created');

                // Reload a specific component (assumed to be named 'Show') after a slight delay
                setTimeout(() => {
                    Inertia.reload({only: ['Show']});
                }, 1300);
            }
        } catch (error) {
            // Log any errors to the console
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
                    className='p-2 px-4 border border-1'
                    key={field.id}
                    type={field.field_type}
                    placeholder={field.field_name}
                    value={formData[field.field_name]}
                    onChange={e => setFormData({ ...formData, [field.field_name]: e.target.value })}
                />
            ))}
        </div>
        <div className='mt-3 flex justify-end'>
            <PrimaryButton onClick={handleSave}>Create Customer</PrimaryButton>
        </div>
        </>
    );
};

export default Create;
