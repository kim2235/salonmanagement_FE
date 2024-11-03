import {SelectedService, Service} from "./Service";

export interface Package {
    id: number;
    name: string;
    description : string;
    services: SelectedService[];
    pricingType: string;
    price: number;
    cost?: number;
    duration: string;
    category?: number | string;
    aftercareDescription?: string;
    created_at: string;

}
export interface PackageContextType {
    valuePackage: { [key: number]: Package[] };
    setValuePackage: React.Dispatch<React.SetStateAction<{ [key: number]: Package[] }>>;
}
