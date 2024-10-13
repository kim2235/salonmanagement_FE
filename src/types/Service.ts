import exp from "node:constants";

export interface Service {
    id: number;
    name: string;
    description: string;
    aftercareDescription: string;
    cost: number;
    created_at: string;
    category: number;
}

export interface SelectedService {
    id: number;
    serviceName: string;
    category: number;
    price: number;
}
export interface ServicesContextType {
    valueService: { [key: number]: Service[] }; // Data structure with category ID as key and array of services.json as value
    setValueService: React.Dispatch<React.SetStateAction<{ [key: number]: Service[] }>>;
}
