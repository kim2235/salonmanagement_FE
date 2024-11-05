import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { Category} from "../../types/Category";

interface CategoriesState {
    categories: Category[];
}

const initialState: CategoriesState = {
    categories: [],
};

const productCategorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (state, action: PayloadAction<Category>) => {
            state.categories.push(action.payload);
        },
        updateCategory: (state, action: PayloadAction<Category>) => {
            const index = state.categories.findIndex(cat => cat.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        deleteCategory: (state, action: PayloadAction<string | number>) => {
            state.categories = state.categories.filter(category => category.id !== action.payload);
        },
    },
});
export const selectAllCategories = (state: RootState) => state.productCategories.categories;

export const { addCategory, updateCategory,deleteCategory } = productCategorySlice.actions;
export default productCategorySlice.reducer;
