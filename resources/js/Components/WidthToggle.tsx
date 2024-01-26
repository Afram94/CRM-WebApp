import React from 'react';
import { Switch } from '@headlessui/react';
import { useWidth } from '../../providers/WidthContext';
import { FaArrowsAltH, FaCompress } from 'react-icons/fa'; // Import icons for full width and fixed width

const WidthToggle = () => {
    const { isFullWidth, setIsFullWidth } = useWidth();

    return (
        <Switch
            checked={isFullWidth}
            onChange={() => setIsFullWidth(!isFullWidth)}
            className={`${
                isFullWidth ? 'bg-teal-500' : 'bg-gray-400'
            } relative inline-flex items-center w-[62px] h-7 transition-colors duration-300 ease-in-out rounded-full border-2 border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
        >
            {/* Icons */}
            <FaCompress className="text-gray-600 absolute left-1" />
            <FaArrowsAltH className="text-gray-600 absolute right-1" />
            
            {/* Toggle thumb */}
            <span
                aria-hidden="true"
                className={`${
                    isFullWidth ? 'translate-x-8' : 'translate-x-0'
                } inline-block w-6 h-6 transform bg-white rounded-full transition-transform duration-300 ease-in-out`}
            />
        </Switch>
    );
};

export default WidthToggle;
