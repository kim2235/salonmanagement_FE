export interface Client {
    id: string ;
    firstName: string;
    lastName: string;
    email: string;
    areaCode?: string;
    contactNumber: string;
    birthday: string;  // You may want to adjust this to a Date type if handling dates.
    gender: string;  // Assuming these are the only valid options for gender.
    clientSource: string;
    address: string;
    city: string;
    province: string;
    zipcode?: string;
    countryCode?: string;
    created_at?: string;
}

export interface ClientProfileProps {
    clientData?: {
        birthday: string;
        firstName: string;
        lastName: string;
        email: string;
        areaCode: string;
        contactNumber: string;
        gender: string;
        clientSource: string;
        address: string;
        city: string;
        province: string;
        zipcode: string;
        countryCode: string;
    };
    onClientUpdate?: (updatedClientData: any) => void;
}
export interface SelectedClient {
    id: string;
    clientName: string;
    email: string;
}

export interface ClientsContextType {
    valueClient: { [key: number]: Client[] };
    setValueClient: React.Dispatch<React.SetStateAction<{ [key: number]: Client[] }>>;
}
