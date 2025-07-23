import { createAsyncThunk } from "@reduxjs/toolkit";
import { signUp, signIn } from "../api/authAPI";

// Login/SignIn Thunk
export const signInAction = createAsyncThunk(
  "auth/signIn",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const { error, data } = await signIn(credentials);
      console.log("error:", error, "data", data);
      if (error) throw new Error(error);
      if (!data?.user || !data?.token)
        throw new Error("Invalid server response");

      // Store token and user data
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          isActive: data.user.isActive,
          ...(data.user.role === "admin" && {
            permissions: data.user.permissions,
            designation: data.user.designation,
            department: data.user.department,
          }),
          isAuthenticated: data.user.isActive,
        },
        token: data.token,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// SignUp Thunk
export const signUpAction = createAsyncThunk(
  "auth/signUp",
  async ({ formData, userType }, { rejectWithValue }) => {
    try {
      localStorage.removeItem("profile");
      const { error } = await signUp({
        formData,
        role: userType,
      });

      if (error) throw new Error(error.message || "Registration failed");

      return {
        message: "Registration successful!",
        email: formData.get("email"),
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);
