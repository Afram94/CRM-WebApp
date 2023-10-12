import TextInput from '@/Components/TextInput';
import { Customer } from '@/types';
import axios from 'axios';
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import PrimaryButton from '@/Components/PrimaryButton';

import { toast } from 'react-toastify';

interface EditCustomerProps {
    customer: Customer;
    closeModal: () => void; // new prop for handling success
}

const EditCustomer: React.FC<EditCustomerProps> = ({ customer, closeModal }) => {

    const [data, setData] = useState<Partial<Customer>>({
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number
    });

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`/customers/${customer.id}`, data);
            // Maybe provide some user feedback, like a success message.
            closeModal();
            Inertia.visit(`/customers`);
            
            /* toast.success('Customer updated successfully!'); */
    
        } catch (error) {
            // Handle any errors during the update operation.
            console.error('There was an error updating the customer:', error);
        }
    }
    

    return (
        <>
        <div className='grid grid-cols-2 gap-2'>
            <TextInput
                type="text"
                value={data.name}
                onChange={e => setData(prevData => ({ ...prevData, name: e.target.value }))}
            />
            <TextInput
                type="text"
                value={data.email}
                onChange={e => setData(prevData => ({ ...prevData, email: e.target.value }))}
            />
            <TextInput
                type="text"
                value={data.phone_number}
                onChange={e => setData(prevData => ({ ...prevData, phone_number: e.target.value }))}
            />
        </div>
            <div className='mt-3'>
                <PrimaryButton onClick={handleSubmit}>Update</PrimaryButton>
            </div>
        </>
    );
}

export default EditCustomer;
