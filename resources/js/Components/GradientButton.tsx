import React from 'react';

// Update the type to include a general onClick prop
type GradientButtonProps = {
  label: string;
  onClick: () => void; // General onClick function
  icon: React.ReactNode; // Icon as a React node
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const GradientButton: React.FC<GradientButtonProps> = ({ label, onClick, icon, className, ...props }) => {
  const buttonClassName = `relative inline-flex items-center font-bold py-2 pl-4 pr-9 rounded-xl mx-12 focus:outline-none hover:scale-110 active:scale-90 transition-transform duration-300 ease-in-out ${className}`;

  return (
    <button
      {...props}
      onClick={onClick} // Use the general onClick function
      className={`${buttonClassName} bg-gradient-to-r dark:from-indigo-400 dark:to-indigo-600 text-white from-gray-700 to-gray-900 dark:text-gray-100 border-2`}
    >
      <span className="z-10 flex-grow px-2 dark:text-indigo-100 text-slate-100">{label}</span>
      <div className="absolute -right-2 flex items-center justify-center rounded-full p-3 border-2 shadow-md 
        dark:bg-indigo-400
        dark:text-slate-100
        dark:border-white
        bg-gray-700
        text-gray-300
        border-gray-300">
        {icon}
      </div>
    </button>
  );
};

export default GradientButton;


            {/* <div className="inline-flex items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-2 px-4 rounded-full">
                <span className="pr-2">Add New</span>
                <div className="flex items-center justify-center bg-white text-blue-600 rounded-full p-2">
                <FaPlus />
                </div>
            </div> */}