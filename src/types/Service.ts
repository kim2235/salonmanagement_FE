import exp from "node:constants";

export interface Service {
    id: number;
    guid?: string;
    name: string;
    description: string;
    aftercareDescription: string;
    cost: number;
    pricingType?: string;
    price?: number;
    duration?: string;
    created_at: string;
    category: number | string;
    serviceProductUsed?: Array<{ id: number; name: string; amt: number }>;
}

export interface SelectedService {
    id: number;
    name: string;
    category: string| number;
    price: number;
}

export type ServiceProductUsed = {
    id: number;
    name: string;
    amt: number;
};

export interface ServicesContextType {
    valueService: { [key: number]: Service[] }; // Data structure with category ID as key and array of services.json as value
    setValueService: React.Dispatch<React.SetStateAction<{ [key: number]: Service[] }>>;
}
