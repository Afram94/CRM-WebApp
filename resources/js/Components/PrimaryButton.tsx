import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled ? 'opacity-25' : ''
                } ${
                    // Light mode styles
                    'bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:ring-indigo-500 ' +
                    // Dark mode styles
                    'dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:bg-blue-500 dark:active:bg-blue-700 dark:focus:ring-blue-300'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
