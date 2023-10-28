import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { successToast } from '@/Components/toastUtils';
import { CustomField, CustomFieldValue, Customer } from '@/types';

interface EditCustomerProps {
    customer: Customer;
    closeModal: () => void;
}

const EditCustomer: React.FC<EditCustomerProps> = ({ customer, closeModal }) => {
    const [data, setData] = useState<Partial<Customer>>({
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone_number,
    });

    const initializeFieldValues = (fields: CustomField[], values: CustomFieldValue[]): CustomFieldValue[] => {
        return fields.map(field => {
          const existingValue = values.find(v => v.field_id === field.id);
          return {
            field_id: field.id,
            value: existingValue ? existingValue.value : ''
          };
        });
      };
      
      

    const [customFieldsVlaue, setCustomFieldsVlaue] = useState(customer.custom_fields_values || []);

    const [customFields, setCustomFields] = useState<any[]>([]);  // Add this line

    // Fetch custom fields when component mounts
    useEffect(() => {
        axios.get('/custom-fields').then(response => {
            setCustomFields(response.data);
            console.log(response.data);
            setCustomFieldsVlaue(initializeFieldValues(response.data, customer.custom_fields_values));

        });
    }, []);

    const handleSubmit = async () => {
        try {
            // Update customer basic details
            await axios.put(`/customers/${customer.id}`, data);

            // Update custom fields
            const customFieldPayload = {
                custom_fields: customFieldsVlaue.reduce((acc, field) => {
                    return {
                        ...acc,
                        [field.field_id]: field.value,
                    };
                }, {}),
            };

            await axios.put(`/customers/${customer.id}/custom-fields`, customFieldPayload);

            closeModal();
            successToast('Customer details have been updated');
            setTimeout(() => {
                Inertia.reload({ only: ['Show'] });
            }, 1300);
        } catch (error) {
            console.error('There was an error updating the customer:', error);
        }
    };
    

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
       

        {customFields.map((field) => {
            const fieldValue = customFieldsVlaue.find(fv => fv.field_id === field.id)?.value || ''; // Find the corresponding value
            return (
                <TextInput
                    className='p-2 px-4 border border-1'
                    key={field.id}
                    type={field.field_type}
                    placeholder={field.field_name}
                    value={fieldValue}  // Use the found value
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setCustomFieldsVlaue((prevFields) =>
                            prevFields.map((f) =>
                                f.field_id === field.id ? { ...f, value: newValue } : f // Use field_id to match
                            )
                        );
                    }}
                />
            );
        })}
    </div>
            <div className='mt-3'>
                <PrimaryButton onClick={handleSubmit}>Update</PrimaryButton>
            </div>
        </>
    );
}

export default EditCustomer;
