import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {Service, ServiceProductUsed} from '../../types/Service';
import { createSelector } from 'reselect';

interface ServicesState {
    valueService: { [key: string]: Service[] }; // Change to string if category is string
}

const initialState: ServicesState = {
    valueService: {},
};

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        addOrUpdateService: (state, action: PayloadAction<Service>) => {
            const service = action.payload;
            const category: string = service.category.toString(); // Ensure category is string

            if (!state.valueService[category]) {
                state.valueService[category] = [];
            }

            const existingIndex = state.valueService[category].findIndex((s: Service) => s.id === service.id);

            if (existingIndex !== -1) {
                state.valueService[category][existingIndex] = service;
            } else {
                state.valueService[category].push(service);
            }
        },
    },
});

export const selectServiceById = (state: RootState, serviceId: string) => {
    // Iterate over categories and find the service by ID
    for (let category in state.services.valueService) {
        const service = state.services.valueService[category].find(s => s.id.toString() === serviceId);
        if (service) {
            return service; // Found the service
        }
    }
    return null; // Return null if service not found
};

export const getServicesByProductId = createSelector(
    (state: RootState, productId: number) => productId, // Input selector for productId
    (state: RootState) => state.services.valueService, // Input selector for services state
    (productId, valueService) => {
        // Logic to filter services by productId
        const allServices = Object.values(valueService).flat();
        return allServices.filter(service =>
            service.serviceProductUsed?.some((product: ServiceProductUsed) => product.id === productId)
        );
    }
);
export const { addOrUpdateService } = serviceSlice.actions;
export const selectServicesByCategory = (state: RootState, category: string) => state.services.valueService[category] || []; // Use string here
export default serviceSlice.reducer;
