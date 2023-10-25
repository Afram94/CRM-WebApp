// src/components/AddCustomField.tsx

import React, { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';

const AddCustomField: React.FC = () => {
  const [fieldName, setFieldName] = useState<string>('');
  const [fieldType, setFieldType] = useState<string>('string'); // Default to "string"

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldName(e.target.value);
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFieldType(e.target.value);
  };

  const handleButtonClick = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await axios.post('/add-custom-field', {
        field_name: fieldName,
        field_type: fieldType,
      });

      if (response.status === 200) {
        alert('Custom field added successfully');
      }
    } catch (error) {
      alert('Failed to add custom field');
    }
  };

  return (
    <div>
      <h1>Add a Custom Field</h1>
      <input
        type="text"
        placeholder="Field Name"
        value={fieldName}
        onChange={handleFieldChange}
      />
      <select value={fieldType} onChange={handleTypeChange}>
        <option value="string">String</option>
        <option value="integer">Integer</option>
        <option value="boolean">Boolean</option>
      </select>
      <button onClick={handleButtonClick}>Add Custom Field</button>
    </div>
  );
};

export default AddCustomField;
