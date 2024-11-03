import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Service } from '../../types/Service';

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

export const { addOrUpdateService } = serviceSlice.actions;
export const selectServicesByCategory = (state: RootState, category: string) => state.services.valueService[category] || []; // Use string here
export default serviceSlice.reducer;
