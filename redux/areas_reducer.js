import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";
import { dataFullData, getDistanceFromRes } from "../components/functions/functions";
import { FirebaseLocation } from "../components/functions/firebase";

const AreasReducer = createSlice({
    name: "areas",
    initialState: {
        areas: [],
    },
    reducers: {

        setAreasLocation(state, action) {
            state.areas = action.payload
            console.log(action.payload[0])
            let minArea = null
            action.payload.map((it, i) => {
                const { id, latitude, longitude, name } = it
                const from = { latitude: 24.8079746, longitude: 67.0396918 }
                const to = { latitude, longitude }
                const { distance } = getDistanceFromRes(from, to)

                if (minArea == null || distance < minArea.distance) {
                    minArea = { ...it, distance }
                }
            })
            console.log(minArea)
            const latitude = 24.8079746
            const longitude = 67.0396918
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${24.8079746}&lon=${67.0396918}`;

            fetch(apiUrl, {
                headers: {
                    'Accept-Language': 'en',
                },
            })
                .then(response => response.json())
                .then(data => {

                    // Handle the response data
                    const { display_name } = data
                    const myArray = display_name.split(',')
                    const modifiedArray = myArray.slice(0, myArray.length - 3);
                    const name = modifiedArray.join(',');
                    const { dateInt } = dataFullData()
                    const detail = ({ id: dateInt.toString(), name, latitude, longitude });



                })
                .catch(error => {
                    console.error('Error:', error);
                });

        },



    },
});

export const { setAreasLocation, } = AreasReducer.actions;
export default AreasReducer.reducer;
