// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
// import { ActionTypes } from "../types"; // Import action types

const initialState = {
  user: null,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    signUpSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.successMessage = action.payload;
    },
    signUpFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null;
    },
    logout: (state) => {
      state.user = null;
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

// Export the action creators
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  logout,
  clearAuthMessages,
} = authSlice.actions;

export default authSlice.reducer;
