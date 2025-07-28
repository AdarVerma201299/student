// src/routes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./Components/auth/RequireAuth";
import LoadingSpinner from "./Components/Common/LoadingSpinner";

// Non-lazy loaded components
import Home from "./Pages/Common/Home";
import SignIn from "./Pages/Common/SignIn";
import SignUp from "./Pages/Common/SignUp";
import NotFoundPage from "./Pages/Common/NotFoundPage";
// import AccessDenied from "./Pages/Common/AccessDenied";

// Lazy loaded components
const Profile = lazy(() => import("./Pages/Common/Profile"));
const Payment = lazy(() => import("./Pages/Student/Payment/Payment"));
const Dashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const StudentManagement = lazy(() =>
  import("./Pages/Admin/Students/StudentManagement")
);
// const ShiftAllotment = lazy(() => import("./Pages/Admin/S"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin/:userType?" element={<SignIn />} />
        <Route path="/signup/:userType?" element={<SignUp />} />
        {/* <Route path="/access-denied" element={<AccessDenied />} /> */}

        {/* Protected Routes */}
        <Route
          element={
            <RequireAuth allowedRoles={["student", "admin", "sub-admin"]} />
          }
        >
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/payment" element={<Payment />} />

          {/* Admin Routes */}
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/student-management/:role/:id/:view?"
              element={<StudentManagement />}
            />
            {/* <Route path="/shift-allotment" element={<ShiftAllotment />} /> */}
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
