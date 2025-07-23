// src/components/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ permissions }) => {
  return (
    <div className="w-64 bg-indigo-800 text-white">
      <div className="p-4">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
      </div>

      <nav className="mt-6">
        <NavLink
          to="/admin/dashboard"
          className="block py-2 px-4 hover:bg-indigo-700"
          activeClassName="bg-indigo-900"
        >
          Overview
        </NavLink>

        {permissions?.canManagestudents && (
          <NavLink
            to="/admin/students"
            className="block py-2 px-4 hover:bg-indigo-700"
            activeClassName="bg-indigo-900"
          >
            Student Management
          </NavLink>
        )}

        {permissions?.canManagePayments && (
          <NavLink
            to="/admin/payments"
            className="block py-2 px-4 hover:bg-indigo-700"
            activeClassName="bg-indigo-900"
          >
            Payment Management
          </NavLink>
        )}

        {permissions?.canManageadmins && (
          <NavLink
            to="/admin/staff"
            className="block py-2 px-4 hover:bg-indigo-700"
            activeClassName="bg-indigo-900"
          >
            Staff Management
          </NavLink>
        )}

        {/* Department-specific routes */}
        {permissions?.allowedDepartments?.includes("IT") && (
          <NavLink
            to="/admin/it-dashboard"
            className="block py-2 px-4 hover:bg-indigo-700"
            activeClassName="bg-indigo-900"
          >
            IT Dashboard
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default AdminSidebar;
