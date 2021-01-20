import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    isActive: false,
    currentMovement: null,
  },
  reducers: {
    launchCreateForm: {
      reducer(state) {
        state.isActive = true;
      },
    },
    launchEditForm: {
      reducer(state, action) {
        state.currentMovement = action.payload.movement;
        state.isActive = true;
      },
    },
    closeForm: {
      reducer(state) {
        state.isActive = false;
        state.currentMovement = null;
      },
    },
  },
});

export const getFormStatus = (state) => state.form.isActive;
export const getCurrentMovement = (state) => state.form.currentMovement;

export const {
  launchCreateForm,
  launchEditForm,
  closeForm,
} = formSlice.actions;

export default formSlice.reducer;
