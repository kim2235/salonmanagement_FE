import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import serviceCategoryReducer from './slices/serviceCategorySlice';
import productCategoryReducer from "./slices/productCategorySlice";
import serviceReducer from './slices/serviceSlice';
import packageReducer from './slices/packageSlice';
import productReducer from './slices/productSlice';
import salesReducer from './slices/salesSlice';
import salesItemReducer from './slices/salesItemsSlice';
import clientsReducer from './slices/clientSlice';
import {persistReducer, persistStore} from "redux-persist";


const persistConfig = {
    key: 'root', // Key for the root storage
    storage,     // Use `localStorage` for persistence
    whitelist: ['products','packages','productCategories','services','serviceCategories', 'sales', 'salesItems', 'clients'],
};

const rootReducer = combineReducers({
    serviceCategories: serviceCategoryReducer,
    productCategories: productCategoryReducer,
    services: serviceReducer,
    packages: packageReducer,
    products: productReducer,
    sales: salesReducer,
    salesItems: salesItemReducer,
    clients: clientsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for Redux Persist
        }),
});

// Step 4: Export `persistor` for use in `PersistGate`
export const persistor = persistStore(store);

// Types for TypeScript users
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
