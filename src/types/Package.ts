import {SelectedService, Service} from "./Service";

export interface Package {
    id: string;
    name: string;
    description : string;
    services: SelectedService[];
    pricingType: string;
    price: number;
    duration: string;
    created_at: string;

}
export interface PackageContextType {
    valuePackage: { [key: number]: Package[] };
    setValuePackage: React.Dispatch<React.SetStateAction<{ [key: number]: Package[] }>>;
}
