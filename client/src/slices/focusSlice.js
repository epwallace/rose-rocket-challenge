import { createSlice } from "@reduxjs/toolkit";

const focusSlice = createSlice({
  name: "focus",
  initialState: null,
  reducers: {
    setFocus: {
      reducer(state, action) {
        const id = action.payload;
        return id;
      },
    },
  },
});

export const { setFocus } = focusSlice.actions;

export default focusSlice.reducer;
