export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
};

export const getImageUrl = (imagePath) => {
  return imagePath
    ? `${process.env.REACT_APP_API_URL}/${imagePath}`
    : "/default-image.png";
};

export const hasAdminRole = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role === "admin";
};
export const calculateLastPaymentDate = (payments = []) => {
  if (!payments.length) return null;
  const [latestPayment] = [...payments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return latestPayment.date;
};

export const calculatePendingMonths = (enrollmentDate, payments = []) => {
  if (!enrollmentDate) return 0;
  const enrollment = new Date(enrollmentDate);
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - enrollment.getFullYear()) * 12 +
    (now.getMonth() - enrollment.getMonth()) +
    1;
  return Math.max(0, totalMonths - payments.length);
};
