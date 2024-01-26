import React from 'react';
import ReusableListbox from './DropdownSelect'; // Update this path as necessary
import { useButtonColor } from '../../providers/ButtonColorContext';

interface OptionType {
  label: string;
  value: string;
}

const ColorPicker = () => {
    const { buttonColor, setButtonColor } = useButtonColor();
    const colors: OptionType[] = [
        { label: 'Blue', value: 'blue-600' },
        { label: 'Red', value: 'red-600' },
        { label: 'Green', value: 'green-400' },
        { label: 'Black', value: 'black' },
    ];

    // Find the currently selected option based on buttonColor value
    const selectedColor = colors.find(color => color.value === buttonColor) || colors[0];

    return (
        <ReusableListbox 
            className='w-32'
            options={colors}
            selected={selectedColor}
            onChange={(selectedOption: OptionType) => setButtonColor(selectedOption.value)}
        />
    );
};

export default ColorPicker;
