import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../api/utils";
// import {
//   fetchStudentStart,
//   fetchStudentSuccess,
//   fetchStudentFailure,
//   processPaymentStart,
//   processPaymentSuccess,
//   processPaymentFailure,
// } from "../slices/studentSlice";

// Payment Processing Thunk
export const processStudentPayment = createAsyncThunk(
  "student/processPayment",
  async (paymentData, { getState, dispatch, rejectWithValue }) => {
    // dispatch(processPaymentStart());
    try {
      const { auth } = getState();
      const token = auth.token || localStorage.getItem("authToken");

      const response = await API.post("/payments", paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Payment processing failed";
      // dispatch(processPaymentFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

// Fetch Student Data Thunk
export const fetchStudentData = createAsyncThunk(
  "student/fetchStudent",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await API.get("/auth/student", { params: { id } });

      // if (response.status === 200 && response.data.status === "success") {
      //   dispatch(
      //     fetchStudentSuccess({
      //       studentData: response.data.data,
      //       feeRecords: response.data.data.feeRecords || [],
      //       paymentHistory: response.data.data.payments || [],
      //     })
      //   );
      return response.data.data;
      // }
      // throw new Error(response.data.message || "Failed to fetch student");
    } catch (error) {
      // dispatch(fetchStudentFailure(error.message));
      return rejectWithValue(error.message);
    }
  }
);

// Remove Student Thunk
export const removeStudent = createAsyncThunk(
  "student/removeStudent",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { student } = getState();

      if (student.pendingMonths > 0) {
        throw new Error("There are pending fees for this student.");
      }

      const token = localStorage.getItem("authToken");
      await API.delete(`/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem(`FeeShiftData${id}`);
      return id; // Return the deleted student ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove student"
      );
    }
  }
);
