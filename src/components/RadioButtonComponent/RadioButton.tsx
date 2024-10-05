import React from 'react';

interface RadioButtonProps {
    label: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    orientation?: 'stack' | 'side-by-side';
}

const RadioButton: React.FC<RadioButtonProps> = ({
                                                     label,
                                                     name,
                                                     value,
                                                     checked,
                                                     onChange,
                                                     orientation = 'side-by-side',
                                                 }) => {
    const containerClass = orientation === 'stack' ? 'flex flex-col mt-3' : 'inline-flex items-center mt-3';

    return (
        <label className={containerClass}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="form-radio h-5 w-5 text-green-600 border-gray-300 focus:ring focus:ring-green-600"
            />
            <span className="ml-2 text-gray-700">{label}</span>
        </label>
    );
};

export default RadioButton;
