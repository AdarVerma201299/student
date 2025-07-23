import { API } from "../api/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

// import { setAlert } from "./alertActions";

// Action types
export const SET_SHIFT_FEES = "SET_SHIFT_FEES";
export const SET_SHIFT_FEE_SUMMARY = "SET_SHIFT_FEE_SUMMARY";
export const UPDATE_SHIFT_FEE = "UPDATE_SHIFT_FEE";
export const fetchStudents = createAsyncThunk(
  "admin/fetchStudents",
  async ({ role, userId }, { rejectWithValue }) => {
    try {
      const response = await API.get("/auth/students", {
        params: { role, userId },
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateStudent = createAsyncThunk(
  "admin/updateStudent",
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "admin/deleteStudent",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.delete("/admin/deleteStudent", {
        params: { userId },
      });
      console.log("response:", response);
      if (response?.data?.success) {
        window.location.reload();
      }
      return response.data.deletedId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk actions
export const fetchStudentShiftFees =
  (studentId, academicYear) => async (dispatch) => {
    try {
      const res = await API.get(
        `/shift-fees/student/${studentId}?year=${academicYear}`
      );
      dispatch({
        type: SET_SHIFT_FEES,
        payload: res.data,
      });
    } catch (err) {
      dispatch();
      // setAlert(err.response?.data?.error || "Failed to fetch fees", "error")
    }
  };

export const createShiftFee = createAsyncThunk(
  "shiftFee/createShiftFee",
  async ({ payload, studentId }, { getState, rejectWithValue }) => {
    console.log(payload, studentId);
    try {
      const { auth } = getState();
      const { user } = auth;

      if (
        !user?.role?.includes("admin") &&
        !user?.role?.includes("sub-admin")
      ) {
        return rejectWithValue("Unauthorized --access");
      }
      const userId = user?._id;
      const response = await API.post("/admin/shift-fees", payload, {
        params: { studentId, userId },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateShiftFee = createAsyncThunk(
  "shiftFee/updateShiftFee",
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      if (
        !user.roles?.includes("admin") &&
        !user.roles?.includes("sub-admin")
      ) {
        return rejectWithValue("Unauthorized access");
      }

      const response = await API.patch(
        `/admin/shift-fees/update/${id}`,
        updates
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchShiftFeeSummary = createAsyncThunk(
  "shiftFee/fetchShiftFeeSummary",
  async (filters, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      if (
        !user.roles?.includes("admin") &&
        !user.roles?.includes("sub-admin")
      ) {
        return rejectWithValue("Unauthorized access");
      }

      const query = new URLSearchParams(filters).toString();
      const response = await API.get(`/shift-fees/summary?${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDashboardData = async () => {
  try {
    const response = await API.get("admin/dashboard/stats");

    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Optional: Set error state or show toast notification
  }
};
