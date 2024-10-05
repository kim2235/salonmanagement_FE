import React from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
    id: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    size?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, checked, onChange, value, size = '25px' }) => {
    const customStyle = {
        '--custom-checkbox-height': size,
    } as React.CSSProperties;

    return (
        <div className={styles.checkboxWrapper} style={customStyle}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                value={value}
            />
            <label htmlFor={id} className={styles.checkBox}></label>
        </div>
    );
};

export default Checkbox;
