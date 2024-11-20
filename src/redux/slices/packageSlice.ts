import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Package } from '../../types/Package';

interface PackagesState {
    valuePackage: { [key: string]: Package[] };
}

const initialState: PackagesState = {
    valuePackage: {},
};

const packageSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {
        addOrUpdatePackage: (state, action: PayloadAction<Package>) => {
            const pkg = action.payload;
            const key = pkg.id;

            if (!state.valuePackage[key]) {
                state.valuePackage[key] = [];
            }

            const existingIndex = state.valuePackage[key].findIndex((p: Package) => p.id === pkg.id);

            if (existingIndex !== -1) {
                // Update existing package
                state.valuePackage[key][existingIndex] = pkg;
            } else {
                // Add new package
                state.valuePackage[key].push(pkg);
            }
        },
    },
});

export const { addOrUpdatePackage } = packageSlice.actions;
export const selectPackageById = (state: RootState, id: string) => state.packages.valuePackage[id] || [];
export default packageSlice.reducer;
