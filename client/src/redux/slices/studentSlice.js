import { createSlice } from "@reduxjs/toolkit";
import {
  processStudentPayment,
  fetchStudentData,
  removeStudent,
} from "../actions/studentActions";
import { createShiftFee, updateShiftFee } from "../actions/adminActions";
import { createPayment } from "../actions/paymentActions";
import {
  calculateLastPaymentDate,
  calculatePendingMonths,
} from "../../utils/helpers";

const initialState = {
  studentData: null,
  feeRecords: [],
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
      console.log(payload);
      state.studentData = payload.studentData;
      state.feeRecords = payload.feeRecords || [];
      state.paymentHistory = payload.paymentHistory || [];
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
    builder
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

      .addCase(fetchStudentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentData.fulfilled, (state, { payload }) => {
        state.studentData = payload;
        state.feeRecords = payload.feeRecords || [];
        state.paymentHistory = payload.paymentHistory || [];
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
      .addCase(createShiftFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShiftFee.fulfilled, (state, { payload }) => {
        state.feeRecords = [...(state.feeRecords || []), payload.data];
        state.loading = false;
      })
      .addCase(createShiftFee.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Fetch Student Shift Fees
      .addCase(updateShiftFee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShiftFee.fulfilled, (state, { payload }) => {
        state.feeRecords = [...(state.feeRecords || []), payload.data];
        state.loading = false;
      })
      .addCase(updateShiftFee.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.paymentHistory = [...(state.paymentHistory || []), payload?.data];
      })
      .addCase(createPayment.rejected, (state, { payload }) => {
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
