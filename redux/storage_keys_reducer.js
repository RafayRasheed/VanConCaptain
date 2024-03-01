import { createSlice } from "@reduxjs/toolkit";
import { setCommonStorage } from "../components/functions/storageMMKV";

const StorageReducer = createSlice({
    name: "storage",
    initialState: {
        keys: [],
    },
    reducers: {

        addStorageKeys(state, action) {

            const find = state.keys.find(it => it == action.payload)
            if (!find && action.payload != 'keys') {

                state.keys = state.keys.push(action.payload)
                setCommonStorage('keys', state.keys)
            }

        },




    },
});

export const { addStorageKeys, } = StorageReducer.actions;
export default StorageReducer.reducer;
