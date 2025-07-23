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
