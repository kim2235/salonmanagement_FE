import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SalesItems } from '../../types/Sales';

interface SalesItemsState {
    valueSalesItems: { [key: number]: SalesItems[] };
}

const initialState: SalesItemsState = {
    valueSalesItems: {},
};

// Selector to get sales items by a specific sale ID
export const selectSalesItemsBySaleId = (state: RootState, saleId: number) =>
    state.salesItems.valueSalesItems[saleId] || [];

const salesItemsSlice = createSlice({
    name: 'salesItems',
    initialState,
    reducers: {
        updateServiceStatus: (
            state,
            action: PayloadAction<{ salesId: number; serviceId: number; isDone: boolean }>
        ) => {
            const { salesId, serviceId, isDone } = action.payload;
            const item = state.valueSalesItems[salesId]?.find((service) => service.id === serviceId);

            if (item) {
                item.isDone = isDone;
            }
        },
        addOrUpdateSalesItem: (state, action: PayloadAction<SalesItems | SalesItems[]>) => {
            const items = Array.isArray(action.payload) ? action.payload : [action.payload];
            items.forEach(item => {
                const saleId = item.salesId;

                // Ensure an array exists for the saleId
                if (!state.valueSalesItems[saleId]) {
                    state.valueSalesItems[saleId] = [];
                }

                // Find index of the existing item with the same id
                const existingIndex = state.valueSalesItems[saleId].findIndex(i => i.id === item.id);

                if (existingIndex !== -1) {

                    state.valueSalesItems[saleId][existingIndex] = item;
                } else {
                    // Add new item
                    state.valueSalesItems[saleId].push(item);
                }
            });
        },
    },
});

export const { addOrUpdateSalesItem,updateServiceStatus } = salesItemsSlice.actions;
export default salesItemsSlice.reducer;
