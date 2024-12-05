import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Notes } from '../../types/Notes';

interface NotesState {
    valueNotes: { [key: string]: Notes };
}

const initialState: NotesState = {
    valueNotes: {},
};

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addOrUpdateNote: (state, action: PayloadAction<Notes>) => {
            const notes = action.payload;
            const key = notes.id;

            if (!state.valueNotes) {
                state.valueNotes = {}; // Safeguard in case `valueNotes` is unexpectedly undefined
            }

            state.valueNotes[key] = notes; // Update or add the note
        },
    },
});

export const { addOrUpdateNote } = notesSlice.actions;

export default notesSlice.reducer;
