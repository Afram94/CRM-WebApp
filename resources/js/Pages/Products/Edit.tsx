// UpdateProduct.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SwitchButton from '@/Components/SwitchButton';
import { Product, ProductCustomField, ProductCustomFieldValue } from '@/types';

interface EditProps {
    product: Product;
    closeModal: () => void;
}

const Edit: React.FC<EditProps> = ({ product, closeModal }) => {
    const [data, setData] = useState({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        sku: product.sku,
        inventoryCount: product.inventory_count,
        category_id: product.category_id?.toString()
    });

    const [customFields, setCustomFields] = useState<ProductCustomField[]>([]);
    const [customFieldsValue, setCustomFieldsValue] = useState<ProductCustomFieldValue[]>([]);

    useEffect(() => {
        axios.get('/product-custom-fields').then(response => {
            setCustomFields(response.data);
            setCustomFieldsValue(initializeFieldValues(response.data, product.custom_fields_values));
        });
    }, [product.custom_fields_values]);

    const initializeFieldValues = (fields: ProductCustomField[], values: ProductCustomFieldValue[]): ProductCustomFieldValue[] => {
        return fields.map(field => {
            const existingValue = values.find(v => v.field_id === field.id);
            return {
                field_id: field.id,
                value: existingValue ? existingValue.value : ''
            };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleCustomFieldChange = (fieldId: number, value: any) => {
        setCustomFieldsValue(prevFields =>
            prevFields.map(f => 
                f.field_id === fieldId ? { ...f, value } : f
            )
        );
    };

    const updateProduct = async () => {
        try {
            const updatePayload = {
                ...data,
                custom_fields: customFieldsValue.reduce((acc, field) => ({
                    ...acc,
                    [field.field_id]: field.value
                }), {})
            };

            await axios.put(`/products/${product.id}`, updatePayload);
            closeModal();
            // Optionally add successToast or Inertia reload here
        } catch (error) {
            console.error('Error updating the product:', error);
        }
    };

    return (
        <>
            <div className='grid grid-cols-1 gap-2'>
                <TextInput 
                    name="name"
                    placeholder="Name"
                    value={data.name}
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={data.description}
                    onChange={handleChange}
                />
                <TextInput 
                    name="price"
                    placeholder="Price"
                    value={data.price}
                    onChange={handleChange}
                />
                <TextInput 
                    name="sku"
                    placeholder="Sku"
                    value={data.sku || ""}
                    onChange={handleChange}
                />
                <TextInput 
                    type="text" 
                    placeholder="Inventory Count" 
                    value={data.inventoryCount}
                    onChange={handleChange}
                />
                {/* Add more inputs for other fields if needed */}
            </div>

            {customFields.map(field => (
                <div key={field.id}>
                    {field.field_type === 'boolean' ? (
                        <SwitchButton
                            enabled={Boolean(customFieldsValue.find(fv => fv.field_id === field.id)?.value)}
                            setEnabled={(value) => handleCustomFieldChange(field.id, value)}
                            css='' // Ensure this prop exists or is optional in SwitchButton
                        />
                    ) : (
                        <TextInput
                            placeholder={field.field_name}
                            value={customFieldsValue.find(fv => fv.field_id === field.id)?.value || ''}
                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        />
                    )}
                </div>
            ))}

            <PrimaryButton onClick={updateProduct}>Update Product</PrimaryButton>
        </>
    );
};

export default Edit;
