import { Customer } from '@/types';
import axios from 'axios';
import React, { useState } from 'react';

/* interface CustomerProps {
    id: number;
    name: string;
} */

const EditCustomer: React.FC<{ customer: Customer }> = ({ customer }) => {

    const [data, setData] = useState<Partial<Customer>>({
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number
    });

    /* const [name, setName] = useState(customer.name);
    const [email, setEmail] = useState(customer.email);
    const [phone_number, setPhone_number] = useState(customer.phone_number); */

    const handleSubmit = () => {
        axios.put(`/customers/${customer.id}`, data )
             .then(response => {
                 // Here, you can handle the success of the update operation.
                 // Maybe provide some user feedback, like a success message.
                 console.log('Customer updated successfully!');
             })
             .catch(error => {
                 // Handle any errors during the update operation.
                 console.error('There was an error updating the customer:', error);
             });
    }

    return (
        <div>
            <input
                type="text"
                value={data.name}
                onChange={e => setData(prevData => ({ ...prevData, name: e.target.value }))}
            />
            <input
                type="text"
                value={data.email}
                onChange={e => setData(prevData => ({ ...prevData, email: e.target.value }))}
            />
            <input
                type="text"
                value={data.phone_number}
                onChange={e => setData(prevData => ({ ...prevData, phone_number: e.target.value }))}
            />
            <button onClick={handleSubmit}>Update</button>
        </div>
    );
}

export default EditCustomer;
