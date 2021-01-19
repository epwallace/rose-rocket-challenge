import { createSlice } from "@reduxjs/toolkit";

let nextMovementId = 11110003;

const movementsSlice = createSlice({
  name: "movements",
  initialState: [
    {
      id: 11110001,
      origin: { lat: 43.6511, lng: -79.347 },
      destination: { lat: 45.4215, lng: -75.6972 },
      description: "Toronto -> Ottawa",
    },
    {
      id: 11110002,
      origin: { lat: 45.4215, lng: -75.6972 },
      destination: { lat: 45.5017, lng: -73.5673 },
      description: "Ottawa -> Montreal",
    },
  ],
  reducers: {
    addMovement: {
      reducer(state, action) {
        const { id, origin, destination, description } = action.payload;
        state.push({ id, origin, destination, description });
      },

      // increment id for the next payload
      prepare(origin, destination, description) {
        return {
          payload: { origin, destination, description, id: nextMovementId++ },
        };
      },
    },
  },
});

export const movementsSelector = (state) => state.movements;

export const { addMovement } = movementsSlice.actions;

export default movementsSlice.reducer;
