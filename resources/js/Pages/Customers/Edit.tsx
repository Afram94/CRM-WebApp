import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { successToast } from '@/Components/toastUtils';
import { CustomField, CustomFieldValue, Customer } from '@/types';
import SwitchButton from '@/Components/SwitchButton';

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

    /**
     * Initializes an array of CustomFieldValue objects based on given fields and values.
     * This is important for editing scenarios in forms where every field needs a value to be controlled components in React.
     * For each field, it searches if there's an existing value for that field.
     * If it finds one, it uses that value; otherwise, it sets an empty string.
     * This ensures that each input in the edit form is able to accept new values, avoiding the 'controlled to uncontrolled' or 'uncontrolled to controlled' component warnings in React.
     *
     * @param {CustomField[]} fields - An array of CustomField objects that contain the metadata of the fields.
     * @param {CustomFieldValue[]} values - An array of CustomFieldValue objects that contain existing field values.
     * 
     * @returns {CustomFieldValue[]} - An array of CustomFieldValue objects with initialized values.
     */
    const initializeFieldValues = (fields: CustomField[], values: CustomFieldValue[]): CustomFieldValue[] => {
        return fields.map(field => {
            const existingValue = values.find(v => v.field_id === field.id);
            if (field.field_type === 'boolean') {
                return {
                    field_id: field.id,
                    value: existingValue ? (existingValue.value === '1' ? true : false) : false // Convert '1' and '0' to true and false respectively
                };
            }
            return {
                field_id: field.id,
                value: existingValue ? existingValue.value : ''
            };
        });
    };

    // Holds the state for the custom field values fetched from or related to a customer.
    // Initializes with either existing values or an empty array.
    const [customFieldsValue, setCustomFieldsValue] = useState(customer.custom_fields_values || []);

    // Holds the state for the metadata of custom fields fetched from the server.
    // Initializes with an empty array.
    const [customFields, setCustomFields] = useState<any[]>([]);  

    // Fetch custom fields and their corresponding values when the component mounts.
    useEffect(() => {
        // Make a GET request to fetch custom fields from the server.
        axios.get('/custom-fields').then(response => {
            // Set the metadata of custom fields into state.
            setCustomFields(response.data);
            
            // Initialize custom field values based on fetched metadata and existing customer values.
            // Makes sure that every custom field has a corresponding value, either existing or an empty string.
            setCustomFieldsValue(initializeFieldValues(response.data, customer.custom_fields_values));
        });
    }, []);

    /* const handleSubmit = async () => {
        try {
            // Update customer basic details
            await axios.put(`/customers/${customer.id}`, data);

            // Update custom fields
            const customFieldPayload = {
                custom_fields: customFieldsValue.reduce((acc, field) => {
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
    }; */

    const handleSubmit = async () => {
        try {
            // Combine fixed and custom field data
            const updatePayload = {
                ...data, // Assuming 'data' contains the fixed fields
                custom_fields: customFieldsValue.reduce((acc, field) => {
                    return { ...acc, [field.field_id]: field.value };
                }, {})
            };
    
            // Make a single PUT request to update the customer
            await axios.put(`/customers/${customer.id}`, updatePayload);
    
            closeModal();
            successToast('Customer details have been updated');
    
            // Reload part of your UI or the entire page as necessary
            /* setTimeout(() => {
                Inertia.reload({ only: ['Show'] });
            }, 1300); */
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
                type="email"
                value={data.email}
                onChange={e => setData(prevData => ({ ...prevData, email: e.target.value }))}
            />
            <TextInput
                type="number"
                value={data.phone_number}
                onChange={e => setData(prevData => ({ ...prevData, phone_number: e.target.value }))}
            />
       

        {/* Dynamic Custom Fields */}
        {customFields.map((field) => {
        // Find the corresponding value for edit form
        const fieldValue = customFieldsValue.find(fv => fv.field_id === field.id)?.value || '';

        return (
            <div key={field.id}>
            {field.field_type === "boolean" ? (
                <SwitchButton
                css=''
                enabled={Boolean(fieldValue)}  // Cast to boolean for the edit form
                setEnabled={(value) => setCustomFieldsValue((prevFields) =>
                    prevFields.map((f) =>
                    f.field_id === field.id ? { ...f, value: value } : f // Use field_id to match
                    )
                )}
                />
            ) : (
                <TextInput
                className='p-2 px-4 border border-1 w-full'
                type={
                    field.field_type === "string" ? "text" :
                    field.field_type === "integer" ? "number" : ""
                }
                placeholder={field.field_name}
                value={(typeof fieldValue === 'boolean' ? fieldValue : fieldValue || '') as string}
                onChange={e => {
                    let value: string | number = e.target.value;
                    if (field.field_type === "integer") {
                    value = Number(value);
                    }
                    setCustomFieldsValue((prevFields) =>
                    prevFields.map((f) =>
                        f.field_id === field.id ? { ...f, value: value } : f // Use field_id to match
                    )
                    );
                }}
                />
            )}
            </div>
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
