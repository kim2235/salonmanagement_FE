import React, { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css'; // Import the updated CSS module

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string; // Optional label prop
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => {
    return (
        <div className="mb-2">
            {label && <label className="block text-sm font-medium mb-2">{label}</label>}
            <select className={styles.select} {...props}>
                {children}
            </select>
        </div>
    );
};

export default Select;
