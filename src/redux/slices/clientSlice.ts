import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Client } from '../../types/Client';

interface ClientsState {
    valueClients: { [key: string]: Client }; // Keyed by client id for easy access
}

const initialState: ClientsState = {
    valueClients: {},
};

const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        addOrUpdateClient: (state, action: PayloadAction<Client>) => {
            const client = action.payload;
            const key = client.id;

            state.valueClients[key] = client; // Add or update the client by ID
        },
        removeClient: (state, action: PayloadAction<string>) => {
            const clientId = action.payload;
            delete state.valueClients[clientId]; // Remove the client by ID
        },
    },
});

export const { addOrUpdateClient, removeClient } = clientsSlice.actions;

// Selectors
export const selectClientById = (state: RootState, id: string): Client | undefined =>
    state.clients.valueClients[id];

export const selectAllClients = (state: RootState): Client[] =>
    Object.values(state.clients.valueClients);

export default clientsSlice.reducer;
