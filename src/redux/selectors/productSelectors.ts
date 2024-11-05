import { createSelector } from 'reselect';
import { RootState } from '../store';
import { Product } from '../../types/Product';

export const selectFlatProducts = createSelector(
    (state: RootState) => state.products.valueProduct,
    (valueProduct) => Object.values(valueProduct).flat() as Product[]
);
