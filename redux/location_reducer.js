import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";
import { Alert } from "react-native";

const locationReducer = createSlice({
    name: "location",
    initialState: {
        current: null,
        history: [],

    },
    reducers: {

        setCurrentLocation(state, action) {
            console.log(state.current)
            if (state.current && state.current.fullName) {
                state.history.push(state.current)
            }
            state.current = action.payload



        },



    },
});

export const { setCurrentLocation } = locationReducer.actions;
export default locationReducer.reducer;
