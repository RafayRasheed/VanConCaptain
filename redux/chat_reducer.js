import { createSlice } from "@reduxjs/toolkit";

const ChatReducer = createSlice({
    name: "chats",
    initialState: {
        chats: [],
    },
    reducers: {

        setChats(state, action) {
            state.chats = action.payload

        },



    },
});

export const { setChats, } = ChatReducer.actions;
export default ChatReducer.reducer;
