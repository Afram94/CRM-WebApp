import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Inertia } from '@inertiajs/inertia';
import { successToast } from '@/Components/toastUtils';
import SwitchButton from '@/Components/SwitchButton';

type FormData = {
    name: string;
    email: string;
    phone_number?: string;
    [key: string]: string | boolean | undefined; // include boolean type here
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
    // Initialize default values for custom fields
    const initializeDefaultCustomFields = (fields: any[]): { [key: string]: string | boolean } => {
        const defaultValues: { [key: string]: string | boolean } = {};
        fields.forEach(field => {
            if (field.field_type === 'boolean') {
                defaultValues[field.field_name] = true;
            } else {
                defaultValues[field.field_name] = '';
            }
        })
        return defaultValues;
    };

    const fetchCustomFields = async () => {
        try {
            const response = await axios.get('/custom-fields');
            setCustomFields(response.data);
            console.log("customFields", response.data)

            // Initialize default values for custom fields
            const defaultValues = initializeDefaultCustomFields(response.data);

            // Merge default custom field values into formData
            setFormData({
                ...formData,
                ...defaultValues
            });
        } catch (error) {
            console.error("Error fetching custom fields:", error);
        }
    };

    useEffect(() => {
        fetchCustomFields();
    }, []);


    /* console.log("customFields", customFields) */

    // Define an asynchronous function named handleSave
    const handleSave = async () => {
        try {
            // Combine the fixed fields and custom fields in formData
            formData.custom_fields = customFields.reduce((acc, field) => {
                acc[field.id] = formData[field.field_name];
                return acc;
            }, {});
    
            // Make an HTTP POST request to create the customer and their custom fields
            const response = await axios.post('/customers', formData);
    
            // Log the response
            console.log("Customer response", response.data);
    
            // Close the modal after successful customer creation
            closeModal();
    
            // You can add more logic here if needed, like reloading parts of your UI
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
            {customFields.map((field) => (
                <div key={field.id}>
                    {field.field_type === "boolean" ? (
                    <SwitchButton
                        css=''
                        enabled={Boolean(formData[field.field_name])}  // Cast to boolean
                        setEnabled={(value) => setFormData({ ...formData, [field.field_name]: value })}
                    />
                    ) : (
                    <TextInput
                        className='p-2 px-4 border border-1 w-full'
                        type={
                        field.field_type === "string" ? "text" :
                        field.field_type === "integer" ? "number" : ""
                        }
                        placeholder={field.field_name}
                        value={(typeof formData[field.field_name] === 'boolean' ? formData[field.field_name] : formData[field.field_name] || '') as string}
                        onChange={e => {
                            let value: string | number = e.target.value;
                            if (field.field_type === "integer") {
                              value = Number(value);
                            }
                            setFormData({ ...formData, [field.field_name]: value });
                          }}
                    />
                    )}
                </div>
                ))}
        </div>
        <div className='mt-3 flex justify-end'>
            <PrimaryButton onClick={handleSave}>Create Customer</PrimaryButton>
        </div>
        </>
    );
};

export default Create;
