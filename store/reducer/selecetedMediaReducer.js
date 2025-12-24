import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedImage :  null
};

export const selectedMediaReducer = createSlice({
    name: 'selectedMediaStore',
    initialState,
    reducers:{
        set: (state, action) => {
            state.selectedImage = action.payload;
        }
    }
});

export const { set } = selectedMediaReducer.actions;
export default selectedMediaReducer.reducer;
