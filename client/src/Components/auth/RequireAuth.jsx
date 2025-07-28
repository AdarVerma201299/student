// src/components/auth/RequireAuth.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingSpinner from "../Common/LoadingSpinner"; // Create this component for loading states

const RequireAuth = ({ allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  if (user === null) {
    return <LoadingSpinner />;
  }
  // if (!user.isAuthenticated) {
  //   return <Navigate to="/signin/admin" state={{ from: location }} replace />;
  // }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
