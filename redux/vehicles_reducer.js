import {createSlice} from '@reduxjs/toolkit';
import {
  deleteLogin,
  getLogin,
  setLogin,
} from '../components/functions/storageMMKV';

const vehiclesReducer = createSlice({
  name: 'vehicles',
  initialState: {
    vehicles: [],
  },
  reducers: {
    deleteVehicle(state, action) {
      state.vehicles = [];
    },
    UpdateVehicle(state, action) {
      //   state.profile = action.payload;
      //   setLogin(action.payload);
    },
    setVehicles(state, action) {
      //   state.profile = action.payload;
      //   setLogin(action.payload);
    },
  },
});

export const {deleteVehicle, UpdateVehicle, setVehicles} =
  vehiclesReducer.actions;
export default vehiclesReducer.reducer;
