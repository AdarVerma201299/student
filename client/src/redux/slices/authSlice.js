import { createSlice } from "@reduxjs/toolkit";
import { signInAction, signUpAction } from "../actions/authAction";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  successMessage: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetauthState: (state) => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return initialState;
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInAction.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(signInAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // SignUp Cases
    builder
      .addCase(signUpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAction.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.successMessage = payload.message;
      })
      .addCase(signUpAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // Persist hydration
    builder.addCase("persist/REHYDRATE", (state, action) => {
      if (action.payload?.auth) {
        return {
          ...state,
          ...action.payload.auth,
          loading: false,
          error: null,
        };
      }
    });
  },
});

export const { resetauthState, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
