import { createSlice } from "@reduxjs/toolkit";
import {
  processStudentPayment,
  fetchStudentData,
  removeStudent,
} from "../actions/studentActions";
import { fetchStudentShiftFees } from "../actions/adminActions";
import {
  calculateLastPaymentDate,
  calculatePendingMonths,
} from "../../utils/helpers";

const initialState = {
  studentData: null,
  feeRecords: [],
  feeSummary: [],
  paymentHistory: [],
  loading: false,
  error: null,
  successMessage: null,
  lastPaymentDate: null,
  pendingMonths: 0,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    fetchStudentSuccess: (state, { payload }) => {
      state.studentData = payload.studentData;
      state.feeRecords = payload.feeRecords || [];
      state.paymentHistory = payload.payments || [];
      state.lastPaymentDate = calculateLastPaymentDate(state.paymentHistory);
      state.pendingMonths = calculatePendingMonths(
        payload.studentData?.createdAt,
        state.paymentHistory
      );
      state.loading = false;
    },
    clearStudentMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetStudentState: () => initialState,
  },
  extraReducers: (builder) => {
    // Single builder chain for all cases
    builder
      // Payment Processing
      .addCase(processStudentPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processStudentPayment.fulfilled, (state, { payload }) => {
        state.paymentHistory.unshift(payload.payment);
        state.lastPaymentDate = payload.payment.date;
        state.pendingMonths = calculatePendingMonths(
          state.studentData?.createdAt,
          state.paymentHistory
        );
        state.loading = false;
        state.successMessage = "Payment processed successfully";
      })
      .addCase(processStudentPayment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Student Data
      .addCase(fetchStudentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentData.fulfilled, (state, { payload }) => {
        state.studentData = payload;
        state.feeRecords = payload.feeRecords || [];
        state.paymentHistory = payload.payments || [];
        state.lastPaymentDate = calculateLastPaymentDate(state.paymentHistory);
        state.pendingMonths = calculatePendingMonths(
          payload.createdAt,
          state.paymentHistory
        );
        state.loading = false;
      })
      .addCase(fetchStudentData.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Remove Student
      .addCase(removeStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeStudent.fulfilled, () => initialState)
      .addCase(removeStudent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Student Shift Fees
      .addCase(fetchStudentShiftFees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentShiftFees.fulfilled, (state, { payload }) => {
        state.feeSummary = payload;
        state.loading = false;
      })
      .addCase(fetchStudentShiftFees.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Persist rehydration
      .addCase("persist/REHYDRATE", (state, action) => {
        if (action.payload?.student) {
          return {
            ...state,
            ...action.payload.student,
            loading: false,
            error: null,
          };
        }
      });
  },
});

export const { clearStudentMessages, resetStudentState, fetchStudentSuccess } =
  studentSlice.actions;

export default studentSlice.reducer;
