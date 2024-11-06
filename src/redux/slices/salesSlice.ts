import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Sales } from '../../types/Sales';

interface SalesState {
    valueSales: { [key: number]: Sales }; // Keyed by sale id for easy access
}

const initialState: SalesState = {
    valueSales: {},
};

const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
        addOrUpdateSale: (state, action: PayloadAction<Sales>) => {
            const sale = action.payload;
            const key = sale.id;

            state.valueSales[key] = sale;
        },
    },
});

export const { addOrUpdateSale } = salesSlice.actions;
export const selectSaleById = (state: RootState, id: number) => state.sales.valueSales[id];
export default salesSlice.reducer;
