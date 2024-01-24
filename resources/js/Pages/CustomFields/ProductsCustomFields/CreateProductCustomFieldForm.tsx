// src/components/CreateProductCustomFieldForm.tsx

import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import DropdownSelect from '@/Components/DropdownSelect';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import Checkbox from '@/Components/Checkbox';
import Tooltip from '@/Components/Tooltip';

type CreateProductCustomFiledsProps = {
    closeModal: () => void;
  }

const fieldTypes = [
  { label: 'String', value: 'string' },
  { label: 'Integer', value: 'integer' },
  { label: 'Boolean', value: 'boolean' },
];

const CreateProductCustomFieldForm: React.FC<CreateProductCustomFiledsProps> = ({ closeModal }) => {
  const [fieldName, setFieldName] = useState<string>('');
  const [fieldType, setFieldType] = useState(fieldTypes[0]);
  const [selectedFieldType, setSelectedFieldType] = useState<string>(fieldTypes[0].value);
  const [isRequired, setIsRequired] = useState<boolean>(false);

  /* const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  }; */

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  const handleFieldTypeChange = (value: string) => {
    setSelectedFieldType(value);
  };

  const handleIsRequiredChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsRequired(e.target.checked);
};

  const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await axios.post('/add-product-custom-field', {
        field_name: fieldName,
        field_type: fieldType.value,
        is_required: isRequired,
      });

      if (response.status === 200) {
        alert('Product custom field added successfully');
        closeModal();
      }
    } catch (error) {
      alert('Failed to add product custom field');
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 gap-2'>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div>
            <InputLabel 
              value="Field Name"
              className='text-md m-1 text-slate-600'
            />
            <TextInput
              type="text"
              placeholder="..."
              value={fieldName}
              onChange={handleFieldChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <div className={`flex justify-start items-center border-2 rounded-lg h-10 mt-7 ${isRequired ? "bg-green-100" : "bg-slate-100"}`}>
              <label className={`text-lg font-semibold font-mono ${isRequired ? "text-slate-600" : "text-slate-400"}`}>
                <Checkbox
                  className='mx-2 w-5 h-5'
                  checked={isRequired} 
                  onChange={handleIsRequiredChange} 
                />
                Required
              </label>
            </div>
            <div className='flex justify-start mt-1'>
              <Tooltip
                content="This button makes the input required. You can change this at any time by clicking the update button in the table and toggling this checkbox."
                positionClasses="md:left-0 md:ml-[-100%]"
              />
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-y-3'>
          <InputLabel className='text-xl text-slate-500'>Custom Field Type:</InputLabel>
          <div className="mb-4 flex gap-3">
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

export default CreateProductCustomFieldForm;
