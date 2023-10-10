import React, { useState } from 'react';
import axios from 'axios';

type FormData = {
    name: string;
    email: string;
    phone_number?: string;
};

const CustomerForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone_number: '' 
    });

    const handleSave = async () => {
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
        <div>
            <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
                type="number"
                placeholder="Phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
            {/* ... other input fields ... */}
            <button onClick={handleSave}>Create Customer</button>
        </div>
    );
};

export default CustomerForm;
