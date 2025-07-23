import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogoutHandler } from "../../utils/function";
import {
  Book,
  Clock,
  BarChart as ChartBar, // Note: 'ChartBar' is actually 'BarChart' in the library
  Person as User, // 'User' is called 'Person' in react-bootstrap-icons
  ShieldLock as Shield, // 'Shield' is called 'ShieldLock'
} from "react-bootstrap-icons";
// import ShiftTime from "../../Components/Common/ShiftTime";

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
  // const features = [
  //   {
  //     icon: <Book size={24} className="text-blue-500" />,
  //     title: "Library Management",
  //     description:
  //       "Track book inventory, manage checkouts, and monitor returns",
  //   },
  //   {
  //     icon: <Clock size={24} className="text-green-500" />,
  //     title: "Attendance Tracking",
  //     description: "Real-time attendance records with analytics",
  //   },
  //   {
  //     icon: <ChartBar size={24} className="text-purple-500" />,
  //     title: "Performance Analytics",
  //     description: "Visual reports on student academic progress",
  //   },
  //   {
  //     icon: <User size={24} className="text-red-500" />,
  //     title: "Student Profiles",
  //     description: "Comprehensive student information database",
  //   },
  //   {
  //     icon: <Shield size={24} className="text-yellow-500" />,
  //     title: "Admin Controls",
  //     description: "Secure system configuration and user management",
  //   },
  // ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white font-sans">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {userType
                ? `Welcome Back, ${userType}`
                : "Library & Student Data Management System"}
            </h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Streamlining academic administration with integrated library
              management, attendance tracking, and performance analytics in one
              unified platform.
            </p>
          </div>

          {/* Login Cards (shown when not logged in) */}
          {!user ? (
            <div className="mb-20">
              <h2 className="text-2xl font-semibold mb-8 text-center">
                Get Started
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                <div
                  onClick={() => handleLogin("student")}
                  className="w-full sm:w-64 p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 hover:shadow-blue-500/20"
                >
                  <div className="text-center">
                    <User size={48} className="mx-auto mb-4 text-blue-200" />
                    <h3 className="text-xl font-semibold mb-2">
                      Student Portal
                    </h3>
                    <p className="text-blue-100">
                      Access your library account and academic records
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => handleLogin("admin")}
                  className="w-full sm:w-64 p-8 bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 hover:shadow-green-500/20"
                >
                  <div className="text-center">
                    <Shield size={48} className="mx-auto mb-4 text-green-200" />
                    <h3 className="text-xl font-semibold mb-2">Admin Portal</h3>
                    <p className="text-green-100">
                      Manage system settings and user accounts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-20">
              <h2 className="text-2xl font-semibold mb-8 text-center">
                Welcome {user.name}
              </h2>
            </div>
          )}

          {/* Features Section */}
          {/* <div className="mt-16">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-4 p-3 bg-gray-700 rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div> */}

          {/* Dashboard Preview (shown when logged in) */}
          {localStorage.getItem("authToken") && (
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <Clock className="text-primary mr-3 text-xl" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Your Quick Access
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Library Dashboard Card */}
                <button
                  onClick={() => navigate("/library")}
                  className="flex flex-col items-center p-5 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-900/50"
                >
                  <div className="p-3 mb-3 bg-blue-100 dark:bg-blue-800 rounded-full">
                    <Book className="text-blue-600 dark:text-blue-300 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Library Dashboard
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Access all library resources
                  </p>
                </button>

                {/* Student Profiles Card */}
                <button
                  onClick={() => navigate(getUserDashboard())}
                  className="flex flex-col items-center p-5 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-100 dark:border-purple-900/50"
                >
                  <div className="p-3 mb-3 bg-purple-100 dark:bg-purple-800 rounded-full">
                    <User className="text-purple-600 dark:text-purple-300 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Student Profiles
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                    Manage student information
                  </p>
                </button>

                {/* Reports Card */}
                <button
                  onClick={() => navigate("/reports")}
                  className="flex flex-col items-center p-5 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border border-green-100 dark:border-green-900/50"
                >
                  <div className="p-3 mb-3 bg-green-100 dark:bg-green-800 rounded-full">
                    <ChartBar className="text-green-600 dark:text-green-300 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Analytics Reports
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                    View performance metrics
                  </p>
                </button>
              </div>

              {/* Enhanced Logout Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Shield className="mr-2" />
                  <span className="font-medium">Secure Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <ShiftTime /> */}
    </div>
  );
};

export default Home;
