// CustomerForm.tsx

import React, { useState } from 'react';
import axios from 'axios';

type FormData = {
    name: string;
    email: string;
    phone?: string;
};

const CustomerForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '' 
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/customers', formData);
            if (response.data.message) {
                // Display the message or do something with the response
                console.log(response.data.message);
            }
            // Handle success. Maybe reset the form or navigate to another page.
        } catch (error) {
            console.error(error);
            // Handle error. Display error messages or handle validation errors.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="First Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <button type="submit">Create Customer</button>
        </form>
    );
};

export default CustomerForm;
