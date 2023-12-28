import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import  InputLabel  from '@/Components/InputLabel';

type CreateCustomerCustomFiledsProps = {
  closeModal: () => void;
}

const fieldTypes = [
  { label: 'String', value: 'string' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
];

const CreateCustomerCustomFieldForm: React.FC<CreateCustomerCustomFiledsProps> = ({ closeModal }) => {
  const [fieldName, setFieldName] = useState<string>('');
  const [selectedFieldType, setSelectedFieldType] = useState<string>(fieldTypes[0].value);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  const handleFieldTypeChange = (value: string) => {
    setSelectedFieldType(value);
  };

  const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await axios.post('/add-custom-field', {
        field_name: fieldName,
        field_type: selectedFieldType, // Use the selectedFieldType here
      });

      if (response.status === 200) {
        alert('Custom field added successfully');
        closeModal();
      }
    } catch (error) {
      alert('Failed to add custom field');
    }
  };

  return (
    <>
      {/* <h1 className="text-2xl mb-6 flex justify-center border-b-2 font-thin mx-48">Add a Custom Field</h1> */}
      <div className='grid grid-cols-1 gap-2'>

        {/* <InputLabel>Custom Filed Name:</InputLabel> */}
        <div className="mb-4">
          <TextInput
            type="text"
            placeholder="Field Name"
            value={fieldName}
            onChange={handleFieldChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className='flex flex-col gap-y-3'>
          <InputLabel className='text-xl text-slate-500'>Custom Filed Type:</InputLabel>
          <div className="mb-4 flex gap-3">
            {/* Render field type options as checkbox-like buttons */}
            {fieldTypes.map((type) => (
              <div 
                key={type.value}
                className={`p-2 border rounded-xl cursor-pointer text-sm w-20 text-center font-mono ${selectedFieldType === type.value ? 'bg-indigo-500 text-white font-semibold' : 'bg-slate-50'}`}
                onClick={() => handleFieldTypeChange(type.value)}
              >
                {type.label}
              </div>
            ))}
          </div>
        </div>
          
          
      </div>
      <div className="flex justify-end">
        <PrimaryButton onClick={handleButtonClick} className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2">
          Add Custom Field
        </PrimaryButton>
      </div>
    </>
  );
};

export default CreateCustomerCustomFieldForm;
