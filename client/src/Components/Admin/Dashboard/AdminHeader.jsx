// src/components/admin/AdminHeader.jsx
import { useDispatch } from "react-redux";
import { LogoutHandler } from "../../../utils/function";
import { useNavigate } from "react-router-dom";
const AdminHeader = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = LogoutHandler(dispatch, navigate);
  return (
    <header className="bg-white w-full shadow-sm">
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-xl font-semibold">
            Welcome, {user.name} ({user.designation || "Admin"})
          </h1>
          <p className="text-sm text-gray-600">
            {user.department
              ? `${user.department} Department`
              : "Administration"}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <img
              src={user.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div> */}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            SignOut
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
