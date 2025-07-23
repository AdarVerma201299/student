import { API } from "./utils";

export const signUp = async ({ formData, role }) => {
  try {
    const res = await API.post(`/${role}/SignUp`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { error: null, data: res.data };
  } catch (error) {
    const errorData = error.response?.data || {};
    return {
      error: {
        message: errorData.message || "Registration failed",
        status: error.response?.status,
        data: errorData,
        validationErrors: errorData.errors,
      },
      data: null,
    };
  }
};
export const signIn = async (formData) => {
  try {
    const res = await API.post(`/${formData.userType}/signin`, formData);
    console.log("API response:", res);
    if (!res.data.success) {
      return {
        error: res.data.error || "Authentication failed",
        data: null,
      };
    }

    return {
      error: null,
      data: {
        user: res.data.user,
        token: res.data.token,
      },
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Login failed";

    return {
      error: errorMessage,
      data: null,
    };
  }
};
