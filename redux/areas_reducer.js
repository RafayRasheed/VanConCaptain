import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";

const AreasReducer = createSlice({
    name: "areas",
    initialState: {
        areas: [],
        allCitiesAreas: {}
    },
    reducers: {

        setAreasLocation(state, action) {
            state.areas = action.payload

        },
        setAllCitiesAreasLocation(state, action) {
            state.allCitiesAreas = []

        },


    },
});

export const { setAreasLocation, setAllCitiesAreasLocation } = AreasReducer.actions;
export default AreasReducer.reducer;
