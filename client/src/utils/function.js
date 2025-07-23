import { resetauthState } from "../redux/slices/authSlice";
import { resetAdminStudentState } from "../redux/slices/adminSlice";
import { resetStudentState } from "../redux/slices/studentSlice";

export const LogoutHandler = (dispatch, navigate) => () => {
  dispatch(resetauthState());
  dispatch(resetStudentState());
  dispatch(resetAdminStudentState());
  localStorage.clear();
    navigate("/"); // or your preferred redirect path
};
export const Datehandle = (GivenDate) => {
  const dateObj = new Date(GivenDate);
  const date = dateObj.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
    { month: "short" }
  );
  return date;
};

export const calculateMonthDifference = (startDate, endDate = new Date()) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime())) throw new Error("Invalid start date");
    if (isNaN(end.getTime())) throw new Error("Invalid end date");
    let months;
    months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();
    if (end.getDate() < start.getDate()) {
      months--;
    }
    return Math.max(0, months);
  } catch (error) {
    console.error("Failed to calculate month difference:", error);
    return 0;
  }
};
export const calculatePaymentStatus = (fee, payments) => {
  const paid = payments.reduce((sum, p) => sum + p.amount, 0);
  if (paid >= fee) return "paid";
  if (paid > 0) return "partial";
  return "pending";
};
