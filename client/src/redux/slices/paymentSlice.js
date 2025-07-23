// src/redux/slices/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shiftFees: [],
  payments: [],
  loading: false,
  error: null,
  successMessage: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.successMessage = null;
    },
    setSuccess: (state, action) => {
      state.successMessage = action.payload;
      state.error = null;
    },
    setShiftFees: (state, action) => {
      state.shiftFees = action.payload;
    },
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
    addPayment: (state, action) => {
      state.payments.unshift(action.payload);
    },
    clearPaymentMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  setShiftFees,
  setPayments,
  addPayment,
  clearPaymentMessages,
} = paymentSlice.actions;

export default paymentSlice.reducer;
