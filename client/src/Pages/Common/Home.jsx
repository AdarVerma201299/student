import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogoutHandler } from "../../utils/function";

import {
  Book,
  Clock,
  BarChart as ChartBar,
  Person as User,
  ShieldLock as Shield,
} from "react-bootstrap-icons";

const Home = () => {
  const userType = "student";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogin = (userType) => {
    navigate(`/signin/${userType}`);
  };

  const handleLogout = LogoutHandler(dispatch, navigate);
  const getUserDashboard = () => {
    if (!user) return "/";
    return user?.role === "student" ? `/profile/${user.id}` : "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white font-sans">
      {/* Adjusted padding for mobile */}
      <div className="pt-16 md:pt-24 pb-8 md:pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - Mobile adjustments */}
          <div className="text-center mb-8 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              {userType
                ? `Welcome Back, ${userType}`
                : "Library & Student Data Management System"}
            </h1>
            <p className="text-base md:text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed px-2">
              Streamlining academic administration with integrated library
              management, attendance tracking, and performance analytics in one
              unified platform.
            </p>
          </div>

          {/* Login Cards - Stack vertically on mobile */}
          {!user ? (
            <div className="mb-12 md:mb-20">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-center">
                Get Started
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                <div
                  onClick={() => handleLogin("student")}
                  className="w-full sm:w-56 p-6 md:p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 hover:shadow-blue-500/20"
                >
                  <div className="text-center">
                    <User
                      size={40}
                      className="mx-auto mb-3 md:mb-4 text-blue-200"
                    />
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Student Portal
                    </h3>
                    <p className="text-sm md:text-base text-blue-100">
                      Access your library account and academic records
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => handleLogin("admin")}
                  className="w-full sm:w-56 p-6 md:p-8 bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 hover:shadow-green-500/20"
                >
                  <div className="text-center">
                    <Shield
                      size={40}
                      className="mx-auto mb-3 md:mb-4 text-green-200"
                    />
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Admin Portal
                    </h3>
                    <p className="text-sm md:text-base text-green-100">
                      Manage system settings and user accounts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-12 md:mb-20">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-center">
                Welcome {user.name}
              </h2>
            </div>
          )}

          {/* Dashboard Preview - Single column on mobile */}
          {localStorage.getItem("authToken") && (
            <div className="mt-6 md:mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4 md:mb-6">
                <Clock className="text-primary mr-2 md:mr-3 text-lg md:text-xl" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                  Your Quick Access
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                {/* Library Dashboard Card */}
                <button
                  onClick={() => navigate("/library")}
                  className="flex flex-col items-center p-4 md:p-5 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-900/50"
                >
                  <div className="p-2 md:p-3 mb-2 md:mb-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                    <Book className="text-blue-600 dark:text-blue-300 text-lg md:text-xl" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-white">
                    Library Dashboard
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Access all library resources
                  </p>
                </button>

                {/* Student Profiles Card */}
                <button
                  onClick={() => navigate(getUserDashboard())}
                  className="flex flex-col items-center p-4 md:p-5 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-100 dark:border-purple-900/50"
                >
                  <div className="p-2 md:p-3 mb-2 md:mb-3 bg-purple-100 dark:bg-purple-800 rounded-full">
                    <User className="text-purple-600 dark:text-purple-300 text-lg md:text-xl" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-white">
                    Student Profiles
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Manage student information
                  </p>
                </button>

                {/* Reports Card */}
                <button
                  onClick={() => navigate("/reports")}
                  className="flex flex-col items-center p-4 md:p-5 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border border-green-100 dark:border-green-900/50"
                >
                  <div className="p-2 md:p-3 mb-2 md:mb-3 bg-green-100 dark:bg-green-800 rounded-full">
                    <ChartBar className="text-green-600 dark:text-green-300 text-lg md:text-xl" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-gray-800 dark:text-white">
                    Analytics Reports
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                    View performance metrics
                  </p>
                </button>
              </div>

              {/* Enhanced Logout Button - Full width on mobile */}
              <div className="mt-6 md:mt-8 flex justify-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full md:w-auto justify-center px-4 py-2 md:px-6 md:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Shield className="mr-2 text-sm md:text-base" />
                  <span className="font-medium text-sm md:text-base">
                    Secure Sign Out
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
