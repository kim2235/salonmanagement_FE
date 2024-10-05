import React, { createContext, useState, ReactNode } from 'react';
import { Package, PackageContextType } from '../types/Package';  // Adjust the import path
const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [valuePackage, setValuePackage] = useState<{ [key: number]: Package[] }>({});

    return (
        <packagesContext.Provider value={{ valuePackage, setValuePackage }}>
            {children}
        </packagesContext.Provider>
    );
};
export const packagesContext = createContext<PackageContextType | undefined>(undefined);
export default PackageProvider;
