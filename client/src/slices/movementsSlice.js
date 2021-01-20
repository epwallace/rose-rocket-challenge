import { createSlice } from "@reduxjs/toolkit";

let nextMovementId = 11110004;

const movementsSlice = createSlice({
  name: "movements",
  initialState: {
    list: [
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
      {
        id: 11110003,
        origin: { lat: 46.4917, lng: -80.993 },
        destination: { lat: 45.4215, lng: -75.6972 },
        description: "Sudbury -> Ottawa",
      },
    ],
    focus: null,
  },

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
    setFocus: {
      reducer(state, action) {
        const id = action.payload;
        state.focus = id;
      },
    },
  },
});

export const movementsSelector = (state) => state.movements.list;

export const {
  addMovement,
  updateMovement,
  deleteMovement,
  setFocus,
} = movementsSlice.actions;

export default movementsSlice.reducer;
