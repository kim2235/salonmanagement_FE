import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    className?: string;
    variant?: 'transparent';
    size?: 'extraSmall' | 'small' | 'medium' | 'large';
    disabled?: boolean; // Add disabled prop
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', variant, size = 'medium', disabled = false }) => {
    const buttonClass = `${styles.customButton} ${variant === 'transparent' ? styles.transparentButton : ''} ${className}`;

    const sizeClass = {
        extraSmall: 'py-0.5 px-1 text-xs',
        small: 'py-1 px-2 text-sm',
        medium: 'py-2 px-4 text-base',
        large: 'py-3 px-6 text-lg',
    }[size];

    // Add styles for disabled state
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            className={`${buttonClass} ${sizeClass} w-full ${disabledClass}`}
            onClick={disabled ? undefined : onClick} // Prevent onClick if disabled
            disabled={disabled} // Disable the button
            role="button"
        >
            {children}
        </button>
    );
};

export default Button;
