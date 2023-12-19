import React, { useEffect, useState } from 'react';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Category } from '@/types';
import axios from 'axios';
import SwitchButton from '@/Components/SwitchButton';

type FormData = {
    name: string;
    description: string;
    price: string;
    sku: string;
    inventoryCount: string;
    category_id: string;
    [key: string]: string | boolean | undefined;
};

type CustomField = {
    id: string;
    field_name: string;
    field_type: string;
};

type CreateProductProps = {
    closeModal: () => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({ closeModal }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        price: '',
        sku: '',
        inventoryCount: '',
        category_id: ''
    });

    const [customFields, setCustomFields] = useState<CustomField[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCustomFields = async () => {
            try {
                const response = await axios.get('/product-custom-fields');
                setCustomFields(response.data);
                // Initialize default values for custom fields
                const defaultValues = response.data.reduce((acc: { [key: string]: string | boolean }, field: CustomField) => {
                    acc[field.field_name] = field.field_type === 'boolean' ? false : '';
                    return acc;
                }, {});
                setFormData(formData => ({ ...formData, ...defaultValues }));
            } catch (error) {
                console.error('Error fetching custom fields:', error);
            }
        };

        fetchCustomFields();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/get-categories');
                console.log(response.data); // Log to inspect the structure
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Handle error
            }
        };

        fetchCategories();
    }, []);

    const handleInputChange = (name: string, value: string | boolean) => {
        setFormData({ ...formData, [name]: value });
    };

    const addProduct = async () => {
        try {
            // Prepare custom fields data
            const customFieldsData = customFields.reduce((acc: { [key: string]: string | boolean }, field: CustomField) => {
                const fieldValue = formData[field.field_name];
                acc[field.id] = fieldValue !== undefined ? fieldValue : (field.field_type === 'boolean' ? false : '');
                return acc;
            }, {});
    
            const response = await axios.post('/products', {
                ...formData,
                custom_fields: customFieldsData
            });
    
            console.log('Product added:', response.data);
            closeModal(); // Close modal on success
        } catch (error) {
            console.error('Failed to add product:', error);
        }
    };
    
    


    return (
        <>
            <div className='grid grid-cols-1 gap-2'>
                <TextInput 
                    type="text" 
                    placeholder="Name" 
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <textarea
                    className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                />
                <TextInput 
                    type="text" 
                    placeholder="Price" 
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                />
                <TextInput 
                    type="text" 
                    placeholder="SKU" 
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                />
                <TextInput 
                    type="text" 
                    placeholder="Inventory Count" 
                    value={formData.inventoryCount}
                    onChange={(e) => handleInputChange("inventoryCount", e.target.value)}
                />
                <select
                    className='border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm'
                    value={formData.category_id}
                    onChange={(e) => handleInputChange("category_id", e.target.value)}
                >
                    <option value="">Select a Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
    
                {/* Dynamic custom fields inputs */}
                {customFields.map(field => (
                    <div key={field.id}>
                        {field.field_type === 'boolean' ? (
                            <SwitchButton
                                css='' // Add CSS if required
                                enabled={Boolean(formData[field.field_name])}
                                setEnabled={(value) => handleInputChange(field.field_name, value)}
                            />
                        ) : (
                            <TextInput
                                type={field.field_type === 'integer' ? 'number' : 'text'}
                                placeholder={field.field_name}
                                value={formData[field.field_name] as string || ''}
                                onChange={(e) => handleInputChange(field.field_name, e.target.value)}
                            />
                        )}
                    </div>
                ))}
            </div>
            <PrimaryButton className='mt-2' onClick={addProduct}>Add Product</PrimaryButton>
        </>
    );
    
};

export default CreateProduct;
