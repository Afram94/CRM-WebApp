// EditCustomerCustomFields.tsx
import React, { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { CustomerCustomField } from '@/types';
import InputLabel from '@/Components/InputLabel';

interface EditCustomerCustomFieldsProps {
  customerCustomField: CustomerCustomField;
  closeModal: () => void;
}

const fieldTypes = [
  { label: 'String', value: 'string' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
];

const EditCustomerCustomFields: React.FC<EditCustomerCustomFieldsProps> = ({ customerCustomField, closeModal }) => {
  const [fieldName, setFieldName] = useState<string>(customerCustomField.field_name);
  const [fieldType, setFieldType] = useState<string>(customerCustomField.field_type);

  const updateCustomField = async () => {
    try {
      const payload = {
        field_name: fieldName,
        field_type: fieldType
      };
      const response = await axios.put(`/customer-custom-fields/${customerCustomField.id}`, payload);

      console.log('Custom field updated:', response.data);
      closeModal();
    } catch (error) {
      console.error('Failed to update custom field:', error);
    }
  };

  const handleFieldTypeChange = (value: string) => {
    setFieldType(value);
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-2'>
      <InputLabel className='text-xl text-slate-500'>Custom Filed Name:</InputLabel>
        <div className="mb-4">
            <TextInput
            type="text"
            placeholder="Field Name"
            value={fieldName}
            onChange={e => setFieldName(e.target.value)}
            className="w-full p-2 border rounded-md"
            />
        </div>

        <div className='flex flex-col gap-y-3'>
            <InputLabel className='text-xl text-slate-500'>Custom Filed Type:</InputLabel>
            <div className="mb-4 flex gap-3">
                {fieldTypes.map((type) => (
                    <div 
                    key={type.value}
                    className={`p-2 border rounded-xl cursor-pointer text-sm w-20 text-center ${fieldType === type.value ? 'bg-blue-200' : ''}`}
                    onClick={() => handleFieldTypeChange(type.value)}
                    >
                    {type.label}
                    </div>
                ))}
            </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <PrimaryButton onClick={updateCustomField}>Save Changes</PrimaryButton>
      </div>
    </>
  );
};

export default EditCustomerCustomFields;
