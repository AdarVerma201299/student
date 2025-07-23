import { createSlice } from "@reduxjs/toolkit";
import {
  processStudentPayment,
  fetchStudentData,
  removeStudent,
} from "../actions/studentActions";
// Helper functions (unchanged)
const calculateLastPaymentDate = (payments = []) => {
  if (!payments.length) return null;
  const [latestPayment] = [...payments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return latestPayment.date;
};

const calculatePendingMonths = (enrollmentDate, payments = []) => {
  if (!enrollmentDate) return 0;
  const enrollment = new Date(enrollmentDate);
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - enrollment.getFullYear()) * 12 +
    (now.getMonth() - enrollment.getMonth()) +
    1;
  return Math.max(0, totalMonths - payments.length);
};

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
    // Keep your existing synchronous reducers
    fetchStudentSuccess: (state, { payload }) => {
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
    // Payment Processing
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
      });

    // Fetch Student Data
    builder
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
      });

    // Remove Student
    builder
      .addCase(removeStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeStudent.fulfilled, () => initialState)
      .addCase(removeStudent.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // Persist rehydration
    builder.addCase("persist/REHYDRATE", (state, action) => {
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
