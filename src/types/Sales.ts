import {SelectedClient} from "./Client";
export interface Sales {
    id: number,
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
    id: number;
    guid?: string;
    serviceId: number;
    salesId: number;
    name: string;
    cost: number;
    category: number | string;
    description: string;
    isDone?: boolean;
    appointmentColor:  string | undefined;
}


