import { ButtonHTMLAttributes } from 'react';
import { useButtonColor } from '../../providers/ButtonColorContext';

export default function PrimaryButton({ className = '', disabled, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    const { buttonColor } = useButtonColor();

    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled ? 'opacity-25' : ''
                } bg-${buttonColor} text-white hover:bg-${buttonColor}-dark focus:bg-${buttonColor}-dark active:bg-${buttonColor}-darker focus:ring-${buttonColor}-ring ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}