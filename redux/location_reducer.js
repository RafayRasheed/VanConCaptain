import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";

const locationReducer = createSlice({
    name: "location",
    initialState: {
        current: null,
        history: [],

    },
    reducers: {

        setCurrentLocation(state, action) {
            if (state.current) {
                state.history.push(state.current)
            }
            state.current = action.payload


        },



    },
});

export const { setCurrentLocation } = locationReducer.actions;
export default locationReducer.reducer;
