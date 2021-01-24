import { createSlice } from "@reduxjs/toolkit";

let nextMovementId = 11110004;

const movementsSlice = createSlice({
  name: "movements",
  initialState: [
    {
      id: 11110001,
      origin: { lat: 43.6534817, lng: -79.3839347 },
      destination: { lat: 45.421106, lng: -75.690308 },
      description: "Toronto -> Ottawa",
    },
    {
      id: 11110002,
      origin: { lat: 45.421106, lng: -75.690308 },
      destination: { lat: 45.4972159, lng: -73.6103642 },
      description: "Ottawa -> Montreal",
    },
    {
      id: 11110003,
      origin: { lat: 46.487489, lng: -80.9921545 },
      destination: { lat: 45.421106, lng: -75.690308 },
      description: "Sudbury -> Ottawa",
    },
  ],

  reducers: {
    addMovement: {
      reducer(state, action) {
        console.log(action.payload);
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
    updateMovement: {
      reducer(state, action) {
        const { id } = action.payload;
        const index = state.findIndex((movement) => movement.id === id);
        if (index) {
          state[index] = { ...action.payload };
        }
      },
    },
    deleteMovement: {
      reducer(state, action) {
        const id = action.payload;
        return state.filter((movement) => movement.id !== id);
      },
    },
  },
});

export const movementsSelector = (state) => state.movements;

export const {
  addMovement,
  updateMovement,
  deleteMovement,
} = movementsSlice.actions;

export default movementsSlice.reducer;
