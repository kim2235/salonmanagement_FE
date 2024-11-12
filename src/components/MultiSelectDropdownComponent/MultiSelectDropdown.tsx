import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Service } from '../../types/Service';  // Adjust the import path
import { FaTimes } from 'react-icons/fa';
import InputText from "../InputTextComponent/InputText"; // Import the FaTimes icon

interface MultiSelectDropdownProps {
    servicesByCategory: { [key: number]: Service[] }; // Match the context format
    onSelectionChange: (selectedServices: Service[]) => void;
    defaultSelectedServices?: Service[];
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ servicesByCategory, onSelectionChange, defaultSelectedServices = [] }) => {
    const [selectedServices, setSelectedServices] = useState<Service[]>(defaultSelectedServices);
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


    // Remove service from selected services.json
    const handleRemoveService = (serviceId: Number) => {
        setSelectedServices(prev => {
            const isServiceSelected = prev.some(service => service.id === serviceId);

            if (!isServiceSelected) {
                return prev;  // If the service isn't in the list, don't do anything
            }

            const updatedServices = prev.filter(service => service.id !== serviceId);

            setTimeout(() => onSelectionChange(updatedServices), 0);
            return updatedServices;
        });
    };


    useEffect(() => {
        setSelectedServices(defaultSelectedServices);
    }, [defaultSelectedServices]);

    // Attach and clean up event listener for clicks outside
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
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
                        {/* Only show the remove icon if there are more than 1 selected service */}
                        {selectedServices.length > 1 && (
                            <FaTimes
                                className="ml-2 cursor-pointer text-red-500 text-xs"
                                onClick={() => handleRemoveService(service.id)}
                            />
                        )}
</span>

                ))}
            </div>
            {popoverVisible && searchQuery && filteredServices.length > 0 && (
                <div ref={popoverRef} className="absolute top-full left-0 mt-1 w-64 max-h-60 bg-white border border-gray-300 rounded shadow-lg z-10 overflow-y-auto">
                    {filteredServices.map(service => {
                        // Disable the checkbox if there's only one selected service
                        const isLastItem = selectedServices.length === 1 && selectedServices.some(s => s.id === service.id);
                        return (
                            <div key={service.id} className="p-2 border-b border-gray-200">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedServices.some(s => s.id === service.id)}
                                        onChange={() => handleServiceChange(service)}
                                        className="mr-2"
                                        disabled={isLastItem} // Disable if it's the last remaining item
                                    />
                                    {service.name}
                                </label>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default MultiSelectDropdown;
