import { createSlice } from "@reduxjs/toolkit";


const OnlineReducer = createSlice({
    name: "online",
    initialState: {
        online: false,
    },
    reducers: {

        setOnline(state, action) {
            state.online = action.payload

        },



    },
});

export const { setOnline, } = OnlineReducer.actions;
export default OnlineReducer.reducer;
