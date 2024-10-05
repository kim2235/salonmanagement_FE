import React, { createContext, useState, ReactNode } from 'react';
import { Service, ServicesContextType } from '../types/Service';  // Adjust the import path
const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [valueService, setValueService] = useState<{ [key: number]: Service[] }>({});

    return (
        <servicesContext.Provider value={{ valueService, setValueService }}>
            {children}
        </servicesContext.Provider>
    );
};
export const servicesContext = createContext<ServicesContextType | undefined>(undefined);
export default ServicesProvider;
