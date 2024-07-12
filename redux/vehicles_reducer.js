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
      const newVehicle = action.payload;
      // const isExist = state.vehicles.findIndex(it=>it.id==newVehicle.id)
      let isExist = false;
      let updated = [];

      state.vehicles.map(yy => {
        if (yy.id == newVehicle.id) {
          isExist = true;
          updated.push(newVehicle);
        } else {
          updated.push(yy);
        }
      });
      if (!isExist) {
        updated = [newVehicle, ...updated];
      }

      state.vehicles = updated;
      //   setLogin(action.payload);
    },
    setVehicles(state, action) {
      state.vehicles = action.payload;
      //   setLogin(action.payload);
    },
  },
});

export const {deleteVehicle, UpdateVehicle, setVehicles} =
  vehiclesReducer.actions;
export default vehiclesReducer.reducer;
