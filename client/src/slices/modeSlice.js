import { createSlice } from "@reduxjs/toolkit";

const MOVEMENT = "movement";
const ROUTE = "route";

const modeSlice = createSlice({
  name: "mode",
  initialState: MOVEMENT,
  reducers: {
    toggleMode: {
      reducer(state) {
        if (state === MOVEMENT) return ROUTE;
        return MOVEMENT;
      },
    },
  },
});

export const { toggleMode } = modeSlice.actions;

export default modeSlice.reducer;
