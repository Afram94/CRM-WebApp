// src/components/ProductCustomFieldForm.tsx

import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import DropdownSelect from '@/Components/DropdownSelect';
import TextInput from '@/Components/TextInput';

const fieldTypes = [
  { label: 'String', value: 'string' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
];

const ProductCustomFieldForm: React.FC = () => {
  const [fieldName, setFieldName] = useState<string>('');
  const [fieldType, setFieldType] = useState(fieldTypes[0]);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await axios.post('/add-product-custom-field', {
        field_name: fieldName,
        field_type: fieldType.value,
      });

      if (response.status === 200) {
        alert('Product custom field added successfully');
      }
    } catch (error) {
      alert('Failed to add product custom field');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Add a Product Custom Field</h1>
        
        <div className="mb-4">
            <TextInput
            type="text"
            placeholder="Field Name"
            value={fieldName}
            onChange={handleFieldChange}
            className="w-full p-2 border rounded-md"
            />
        </div>
        
        <div className="mb-4">
            <DropdownSelect
            options={fieldTypes}
            selected={fieldType}
            onChange={setFieldType}
            className="w-full p-2 border rounded-md"
            />
        </div>
        
        <div className="flex justify-end">
            <PrimaryButton onClick={handleButtonClick} className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2">
            Add Product Custom Field
            </PrimaryButton>
        </div>
    </div>
  );
};

export default ProductCustomFieldForm;
