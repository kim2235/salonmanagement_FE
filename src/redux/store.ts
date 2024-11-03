import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import categoriesReducer from './slices/categoriesSlice';
import serviceReducer from './slices/serviceSlice';
import packageReducer from './slices/packageSlice';
import productReducer from './slices/productSlice';
import {persistReducer, persistStore} from "redux-persist";


const persistConfig = {
    key: 'root', // Key for the root storage
    storage,     // Use `localStorage` for persistence
    whitelist: ['products','services'],
};

const rootReducer = combineReducers({
    categories: categoriesReducer,
    services: serviceReducer,
    packages: packageReducer,
    products: productReducer
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
