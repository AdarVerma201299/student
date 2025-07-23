// src/redux/actions/paymentActions.js
import API from "../../utils/api";
import { setLoading, setError, setSuccess } from "../slices/paymentSlice";

export const getShiftFees = (studentId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.get(`/shift-fees/student/${studentId}`);
    dispatch({
      type: "payment/setShiftFees",
      payload: response.data,
    });
  } catch (error) {
    dispatch(
      setError(error.response?.data?.message || "Failed to fetch fee details")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const createPayment = (paymentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.post("/payments", paymentData);
    dispatch({
      type: "payment/addPayment",
      payload: response.data,
    });
    dispatch(setSuccess("Payment submitted successfully!"));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Payment failed"));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const getPaymentHistory = (studentId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await API.get(`/payments/student/${studentId}`);
    dispatch({
      type: "payment/setPayments",
      payload: response.data,
    });
  } catch (error) {
    dispatch(
      setError(
        error.response?.data?.message || "Failed to fetch payment history"
      )
    );
  } finally {
    dispatch(setLoading(false));
  }
};
