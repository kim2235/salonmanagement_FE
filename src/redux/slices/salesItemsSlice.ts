import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SalesItems } from '../../types/Sales';
import { createSelector } from 'reselect';
import {getServicesByProductId} from "./serviceSlice";

interface SalesItemsState {
    valueSalesItems: { [key: number]: SalesItems[] };
}

const initialState: SalesItemsState = {
    valueSalesItems: {},
};

// Selector to get sales items by a specific sale ID
export const selectSalesItemsBySaleId = (state: RootState, saleId: number) =>
    state.salesItems.valueSalesItems[saleId] || [];

export const selectSalesItemsByProductId = createSelector(
    (state: RootState, productId: number) => productId,
    (state: RootState) => state.salesItems.valueSalesItems,
    (state: RootState) => state.services.valueService,
    (productId, valueSalesItems, valueService) => {
        // Step 1: Get services associated with the given product ID
        const servicesWithProduct = getServicesByProductId({ services: { valueService } } as RootState, productId);

        // Step 2: Collect all service IDs associated with this product
        const serviceIds = servicesWithProduct.map(service => service.id);

        // Step 3: Find all sales items where `serviceId` matches any of the IDs in `serviceIds`
        return Object.values(valueSalesItems)
            .flat()
            .filter(salesItem => serviceIds.includes(salesItem.serviceId));
    }
);

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
