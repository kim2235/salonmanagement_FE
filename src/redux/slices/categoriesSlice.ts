import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../components/AddCategoryModalComponent/AddCategoryModal';

interface CategoriesState {
    categories: Category[];
}

const initialState: CategoriesState = {
    categories: [],
};

const categoriesSlice = createSlice({
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

export const { addCategory, updateCategory,deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
