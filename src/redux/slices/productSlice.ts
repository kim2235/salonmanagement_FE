import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Product } from "../../types/Product";
import { selectServicesByProductId } from "./serviceSlice";

interface ProductsState {
    valueProduct: { [key: string]: Product[] }; // Dictionary with category as key
}

const initialState: ProductsState = {
    valueProduct: {},
};

export const deleteProduct = createAsyncThunk<void, number, { state: RootState }>(
    'products/deleteProduct',
    (productId, { getState, rejectWithValue }) => {
        const state = getState();
        const isProductInUse = Object.values(state.services.valueService).some(services =>
            services.some(service =>
                service.serviceProductUsed?.some(product => product.id === productId)
            )
        );

        if (isProductInUse) {
            return rejectWithValue('Cannot delete product: Product is being used in a service.');
        }
    }
);

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
    extraReducers: (builder) => {
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            const productId = action.meta.arg;

            // Delete product logic
            Object.keys(state.valueProduct).forEach(category => {
                state.valueProduct[category] = state.valueProduct[category].filter(
                    product => product.id !== productId
                );
            });
        });
    },
});

export const { addOrUpdateProduct } = productsSlice.actions;
export const selectProductsByCategory = (state: RootState, category: string) => state.products.valueProduct[category] || [];
export default productsSlice.reducer;
