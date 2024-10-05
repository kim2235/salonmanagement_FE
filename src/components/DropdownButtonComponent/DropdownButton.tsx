import React, { useState, useRef, useEffect } from 'react';
import styles from './DropdownButton.module.css';
import { measureTextWidth } from '../../utilities/measureTextWidth';

export interface Option {
    label?: string;
    value: string | number | boolean;
}

interface DropdownButtonProps {
    id?: string;
    options: Array<Option | string>; // Accepts either Option objects or strings
    onSelect: (option: string | number | boolean) => void;
    defaultSelected?: string;
    selectedValue?: string;
    placeholder?: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
                                                           options,
                                                           onSelect,
                                                           defaultSelected,
                                                           selectedValue,
                                                           placeholder = 'Select an option'
                                                       }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState<string | null>(defaultSelected ?? null);
    const [dropdownWidth, setDropdownWidth] = useState<string>('auto');
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleOptionSelect = (option: Option | string) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label || option.value.toString();

        setSelectedLabel(optionLabel);
        onSelect(optionValue);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const calculateDropdownWidth = () => {
            const font = '16px Arial';
            const longestOptionWidth = Math.max(
                ...options.map(option =>
                    typeof option === 'string'
                        ? measureTextWidth(option, font)
                        : measureTextWidth(option.label || option.value.toString(), font)
                )
            );
            const padding = 32;
            const baseWidth = longestOptionWidth + padding;

            const smWidth = baseWidth > 200 ? baseWidth : 200;
            const mdWidth = baseWidth > 250 ? baseWidth : 250;
            const lgWidth = baseWidth > 300 ? baseWidth : 300;

            setDropdownWidth(`
                w-[${baseWidth}px] 
                sm:w-[${smWidth}px] 
                md:w-[${mdWidth}px] 
                lg:w-[${lgWidth}px]
            `);
        };

        calculateDropdownWidth();
        window.addEventListener('resize', calculateDropdownWidth);

        return () => {
            window.removeEventListener('resize', calculateDropdownWidth);
        };
    }, [options]);

    useEffect(() => {
        if (selectedValue !== undefined) {
            // Find the label for the selected value
            const selectedOption = options.find(option =>
                typeof option === 'string'
                    ? option === selectedValue
                    : option.value === selectedValue
            );
            setSelectedLabel(typeof selectedOption === 'string' ? selectedOption : selectedOption?.label || selectedValue.toString());
        }
    }, [selectedValue, options]);

    return (
        <div ref={dropdownRef} className="relative inline-block text-left w-full sm:w-auto">
            <div>
                <button
                    type="button"
                    style={{ width: dropdownWidth }}
                    className={`${styles.drpBtn} inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedLabel || placeholder}
                    <svg
                        className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'} transform scale-95`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto z-10 ${styles.customScrollbar}`}
                    style={{ width: dropdownWidth }}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option, index) => {
                            const optionValue = typeof option === 'string' ? option : option.value;
                            const optionLabel = typeof option === 'string' ? option : option.label || option.value.toString();

                            return (
                                <button
                                    key={index}
                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    onClick={() => handleOptionSelect(option)}
                                    role="menuitem"
                                >
                                    {optionLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownButton;
