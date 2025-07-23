// src/Routes.js
// import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
// import RequireAuth from "./Components/auth/RequireAuth";

// Non-lazy loaded components
import Home from "./Pages/Common/Home";
import SignIn from "./Pages/Common/SignIn";
import SignUp from "./Pages/Common/SignUp";
import Profile from "./Pages/Common/Profile";
import Payment from "./Pages/Student/Payment/Payment";

// Lazy loaded components
import Dashboard from "./Pages/Admin/Dashboard";
import StudentManagement from "./Pages/Admin/Students/StudentManagement";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      {/* Authentication Routes */}
      <Route path="/signin">
        <Route index element={<SignIn />} />
        <Route path=":userType" element={<SignIn />} />
      </Route>

      <Route path="/signup">
        <Route index element={<SignUp />} />
        <Route path=":userType" element={<SignUp />} />
      </Route>

      {/* Protected Student Routes */}
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/payment" element={<Payment />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/student-management/:role/:id"
        element={<StudentManagement />}
      />
    </Routes>
  );
};

export default AppRoutes;
