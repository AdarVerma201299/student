import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  List,
  House,
  PersonPlus,
  BoxArrowInRight,
} from "react-bootstrap-icons";
// import SignOut from "../../Pages/Common/SignOut";
import ProfileDropdown from "./ProfileDropdown";
// import useAutoLogout from "../../hooks/useAutoLogout";

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // useAutoLogout();
  // Get user and token directly from Redux store
  const { user } = useSelector((state) => state.auth);

  const toggleNavbar = () => setExpanded(!expanded);

  const getUserDashboard = () => {
    if (!user) return "/";
    return user?.role === "student" ? `/profile/${user.id}` : "/dashboard";
  };

  return (
    <nav
      className={`fixed left-0 top-0 h-screen bg-gray-200 text-gray-800 transition-all duration-300 min-h-2 z-100 ${
        expanded ? "w-50" : "w-16"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col h-full pt-5">
        {/* Header */}
        <div className="flex items-center mb-8 p-2">
          <button
            onClick={toggleNavbar}
            className="text-gray-800 hover:bg-gray-300 p-2 rounded-full transition-colors"
          >
            <List size={24} />
          </button>
          {expanded && (
            <span className="ml-3 font-bold text-xl">Student Portal</span>
          )}
        </div>

        {/* Main Navigation */}
        <div className="flex-1 space-y-2">
          <Link
            to="/"
            className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <House size={24} />
            {expanded && <span className="ml-3">Home</span>}
          </Link>

          {user && (
            <>
              <Link
                className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                to={getUserDashboard()}
              >
                <House size={24} />
                {expanded && <span className="ml-3">Dashboard</span>}
              </Link>

              {user?.role === "admin" && expanded && (
                <div className="ml-8 space-y-1">
                  <Link
                    to="/shift-allotment"
                    className="block p-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Shift Allotment
                  </Link>
                  <Link
                    to="/reports"
                    className="block p-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Reports
                  </Link>
                  <Link
                    to="/user-management"
                    className="block p-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    User Management
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* User Section */}
        <div className="mt-auto border-t border-gray-300 pt-4">
          {user ? (
            <div className="items-center p-2 rounded-lg hover:bg-gray-300 transition-colors">
              {/* <div className="flex-col items-center">
                <img
                  src={user?.profileImage || "/default-avatar.jpg"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <SignOut />
              </div> */}

              <ProfileDropdown />
              {/* {expanded && (
                <div className="text-sm space-y-1 mt-2">
                  <Link
                    to={`/profile/${user.id}`}
                    className="flex items-center hover:text-gray-600"
                  >
                    <PersonCircle size={16} className="mr-2" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center hover:text-gray-600"
                  >
                    <Gear size={16} className="mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center hover:text-gray-600 w-full"
                  >
                    <BoxArrowRight size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )} */}
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/signin/student"
                className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <BoxArrowInRight size={20} />
                {expanded && <span className="ml-3">Login</span>}
              </Link>
              <Link
                to="/signup/student"
                className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <PersonPlus size={20} />
                {expanded && <span className="ml-3">Sign Up</span>}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
