// ButtonColorContext.js

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type OptionType = {
    label: string;
    value: string;
};

// Define the context type
type ButtonColorContextType = {
    buttonColor: string;
    setButtonColor: (color: string) => void;
};

// Provide a default value
const defaultValue: ButtonColorContextType = {
    buttonColor: 'blue-600', // Default button color
    setButtonColor: () => {},
};

const ButtonColorContext = createContext<ButtonColorContextType>(defaultValue);

export const useButtonColor = () => useContext(ButtonColorContext);

type ButtonColorProviderProps = {
    children: ReactNode;
};

export const ButtonColorProvider: React.FC<ButtonColorProviderProps> = ({ children }) => {
    const [buttonColor, setButtonColor] = useState<string>(localStorage.getItem('buttonColor') || 'blue-600');

    useEffect(() => {
        localStorage.setItem('buttonColor', buttonColor);
    }, [buttonColor]);

    return (
        <ButtonColorContext.Provider value={{ buttonColor, setButtonColor }}>
            {children}
        </ButtonColorContext.Provider>
    );
};
