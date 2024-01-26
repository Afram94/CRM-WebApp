// WidthToggle.js
import React from 'react';
import { Switch } from '@headlessui/react';
import { useWidth } from '../../providers/WidthContext';

const WidthToggle = () => {
    const { isFullWidth, setIsFullWidth } = useWidth();

    return (
        <Switch
            checked={isFullWidth}
            onChange={() => setIsFullWidth(!isFullWidth)}
            className={`${
                isFullWidth ? 'bg-green-400' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11`}
        >
            <span className="sr-only">Toggle Full Width</span>
            <span
                className={`${
                    isFullWidth ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition`}
            />
        </Switch>
    );
};

export default WidthToggle;
