import React from "react";
import ReactDOM from "react-dom";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import movementsReducer from "./slices/movementsSlice";
import formReducer from "./slices/formSlice";
import focusReducer from "./slices/focusSlice";

const rootReducer = combineReducers({
  movements: movementsReducer,
  form: formReducer,
  focus: focusReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
