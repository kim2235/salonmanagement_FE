import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Service } from '../../types/Service';  // Adjust the import path
import { FaTimes } from 'react-icons/fa';
import InputText from "../InputTextComponent/InputText"; // Import the FaTimes icon

interface MultiSelectDropdownProps {
    servicesByCategory: { [key: number]: Service[] }; // Match the context format
    onSelectionChange: (selectedServices: Service[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ servicesByCategory, onSelectionChange }) => {
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Filter services.json based on search query
    const filteredServices = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return Object.values(servicesByCategory).flat().filter(service =>
            service.name.toLowerCase().includes(query)
        );
    }, [searchQuery, servicesByCategory]);

    // Handle service change
    const handleServiceChange = (service: Service) => {
        // Update selectedServices in a controlled manner
        setSelectedServices(prev => {
            const isSelected = prev.some(s => s.id === service.id);
            const updatedServices = isSelected
                ? prev.filter(s => s.id !== service.id)
                : [...prev, service];

            // Delay the update of parent component
            setTimeout(() => onSelectionChange(updatedServices), 0);
            return updatedServices;
        });
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPopoverVisible(true);
    };

    // Toggle popover visibility
    const togglePopoverVisibility = () => {
        setPopoverVisible(prev => !prev);
    };

    // Handle click outside to close the popover
    const handleClickOutside = (e: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
            setPopoverVisible(false);
        }
    };

    // Attach and clean up event listener for clicks outside
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Remove service from selected services.json
    const handleRemoveService = (serviceId: string) => {
        setSelectedServices(prev => {
            const updatedServices = prev.filter(service => service.id !== serviceId);
            setTimeout(() => onSelectionChange(updatedServices), 0);
            return updatedServices;
        });
    };

    return (
        <div className="relative">
            <InputText
                type="text"
                placeholder="Search for Available Service to Add.."
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={togglePopoverVisibility}
            />

            <div className="flex mb-2">
                {selectedServices.map(service => (
                    <span key={service.id} className="flex items-center bg-gray-200 rounded px-2 py-1 m-1 text-sm">
                        {service.name}
                        <FaTimes
                            className="ml-2 cursor-pointer text-red-500 text-xs"
                            onClick={() => handleRemoveService(service.id)}
                        />
                    </span>
                ))}
            </div>
            {popoverVisible && searchQuery && filteredServices.length > 0 && (
                <div ref={popoverRef} className="absolute top-full left-0 mt-1 w-64 max-h-60 bg-white border border-gray-300 rounded shadow-lg z-10 overflow-y-auto">
                    {filteredServices.map(service => (
                        <div key={service.id} className="p-2 border-b border-gray-200">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedServices.some(s => s.id === service.id)}
                                    onChange={() => handleServiceChange(service)}
                                    className="mr-2"
                                />
                                {service.name}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
