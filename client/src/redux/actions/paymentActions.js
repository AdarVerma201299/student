// src/redux/actions/paymentActions.js
import { API } from "../api/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (payload, { rejectWithValue }) => {
    // Receive the entire payload
    try {
      const { paymentData, studentId, academicYear } = payload;
      console.log(payload);
      const response = await API.post(
        "/auth/makepayment",
        {
          ...paymentData,
          academicYear,
        },
        {
          params: { studentId },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
