import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {Product} from "../../types/Product";


interface ProductsState {
    valueProduct: { [key: string]: Product[] }; // Dictionary with category as key
}

const initialState: ProductsState = {
    valueProduct: {},
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addOrUpdateProduct: (state, action: PayloadAction<Product>) => {
            const product = action.payload;
            const category: string = product.category.toString(); // Ensure category is string

            if (!state.valueProduct[category]) {
                state.valueProduct[category] = [];
            }

            const existingIndex = state.valueProduct[category].findIndex((p: Product) => p.id === product.id);

            if (existingIndex !== -1) {
                // Update existing product
                state.valueProduct[category][existingIndex] = product;
            } else {
                // Add new product
                state.valueProduct[category].push(product);
            }
        },
    },
});

export const { addOrUpdateProduct } = productsSlice.actions;
export const selectProductsByCategory = (state: RootState, category: string) => state.products.valueProduct[category] || [];
export default productsSlice.reducer;
