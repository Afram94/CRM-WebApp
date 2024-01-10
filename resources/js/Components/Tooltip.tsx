import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    // You can provide specific position classes as a prop if needed
    positionClasses?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, positionClasses = '' }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative flex items-center">
            <div
                className="w-5 h-5 flex items-center justify-center bg-blue-100 rounded-full cursor-pointer text-sm text-blue-600"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                ?
            </div>
            {show && (
                // The tooltip is conditionally rendered and positioned based on the classes provided
                <div className={`absolute bg-black text-white text-sm p-2 rounded-lg shadow-md z-10 w-[300px] ${positionClasses} max-w-xs`}
                     style={{ top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' }} // Adjust this line to control the position
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
