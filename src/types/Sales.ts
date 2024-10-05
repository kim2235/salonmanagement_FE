import {SelectedClient} from "./Client";
export interface Sales {
    id: string,
    client: SelectedClient,
    subtotal: number,
    tax: number,
    total: number,
    payment: number,
    status: string,
    balance: number,
    date: string
}

export interface SalesItems {
    id: string;
    serviceId: string;
    salesId: string;
    name: string;
    cost: number;
    category: number;
    description: string;
    appointmentColor:  string | undefined;
}
