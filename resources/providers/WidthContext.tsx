import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define a type for the context value
type WidthContextType = {
    isFullWidth: boolean;
    setIsFullWidth: (isFullWidth: boolean) => void;
};

// Provide a default value
const defaultValue: WidthContextType = {
    isFullWidth: false, // Default value
    setIsFullWidth: () => {}, // Placeholder function
};

// Create the context with the default value
const WidthContext = createContext<WidthContextType>(defaultValue);

export const useWidth = () => useContext(WidthContext);

type WidthProviderProps = {
    children: ReactNode;
};

export const WidthProvider: React.FC<WidthProviderProps> = ({ children }) => {
    const [isFullWidth, setIsFullWidth] = useState<boolean>(localStorage.getItem('isFullWidth') === 'true');

    useEffect(() => {
        localStorage.setItem('isFullWidth', String(isFullWidth));
    }, [isFullWidth]);

    return (
        <WidthContext.Provider value={{ isFullWidth, setIsFullWidth }}>
            {children}
        </WidthContext.Provider>
    );
};
