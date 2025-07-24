// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ChartBarIcon,
  UsersIcon,
  CreditCardIcon,
  CogIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  StatCard,
  ActivityFeed,
} from "../../Components/Admin/Dashboard/DashboardComponents";
import { Link } from "react-router-dom";
import AdminHeader from "../../Components/Admin/Dashboard/AdminHeader";
import { fetchDashboardData } from "../../redux/actions/adminActions";
import { DashboardLoadingSkeleton } from "../LoadingPage";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalStudents: 0,
    recentPayments: 0,
    totalDepartments: 0,
    studentGrowth: 0,
    paymentGrowth: 0,
    totalPaymentsAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardData();
        setStats(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <DashboardLoadingSkeleton />;

  return (
    <div className="ml-0 md:ml-44 p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="w-full">
        <AdminHeader user={user} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          change="+12.5%"
          icon={<AcademicCapIcon className="h-6 w-6 text-blue-500" />}
          color="blue"
          show={user.permissions?.canManagestudents}
        />
        <StatCard
          title="Recent Payments"
          value={stats.totalDepartments}
          change="+5.2%"
          icon={<CreditCardIcon className="h-6 w-6 text-green-500" />}
          color="green"
          show={user.permissions?.canManagePayments}
        />
        <StatCard
          title="Active Users"
          value={stats.studentGrowth}
          change="-2.1%"
          icon={<UsersIcon className="h-6 w-6 text-purple-500" />}
          color="purple"
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={<BuildingOfficeIcon className="h-6 w-6 text-orange-500" />}
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {user.permissions?.canManagestudents && (
                <Link to={`/student-management/${user.role}/${user.id}`}>
                  <button className="flex flex-col items-center p-3 md:p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors w-full">
                    <UsersIcon className="h-6 md:h-8 w-6 md:w-8 text-blue-600 mb-1 md:mb-2" />
                    <span className="font-medium text-xs md:text-sm">
                      Manage Students
                    </span>
                  </button>
                </Link>
              )}
              {user.permissions?.canManagePayments && (
                <button className="flex flex-col items-center p-3 md:p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors w-full">
                  <CreditCardIcon className="h-6 md:h-8 w-6 md:w-8 text-green-600 mb-1 md:mb-2" />
                  <span className="font-medium text-xs md:text-sm">
                    Process Payments
                  </span>
                </button>
              )}
              {user.permissions?.canManageadmins && (
                <button className="flex flex-col items-center p-3 md:p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors w-full">
                  <CogIcon className="h-6 md:h-8 w-6 md:w-8 text-purple-600 mb-1 md:mb-2" />
                  <span className="font-medium text-xs md:text-sm">
                    Admin Settings
                  </span>
                </button>
              )}
              <button className="flex flex-col items-center p-3 md:p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors w-full">
                <ChartBarIcon className="h-6 md:h-8 w-6 md:w-8 text-orange-600 mb-1 md:mb-2" />
                <span className="font-medium text-xs md:text-sm">
                  View Reports
                </span>
              </button>
            </div>
          </Card>

          {/* Analytics Chart */}
          <Card title="Activity Overview">
            <div className="h-48 md:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-sm md:text-base">
                Analytics chart will appear here
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:space-y-6">
          {/* User Profile Summary */}
          <Card title="Your Profile">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                  src={user.profileImage || "/default-avatar.png"}
                  alt="Profile"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm md:text-base">
                  {user.name}
                </h4>
                <p className="text-xs md:text-sm text-gray-500">{user.email}</p>
                <p className="text-xs md:text-sm mt-1">
                  <span className="font-medium">Role:</span> {user.role}
                  {user.department && ` • ${user.department}`}
                </p>
              </div>
            </div>
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
              <h5 className="font-medium mb-1 md:mb-2 text-sm md:text-base">
                Permissions Summary
              </h5>
              <ul className="space-y-1 text-xs md:text-sm">
                {user.permissions?.canManagestudents && (
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Manage
                    Students
                  </li>
                )}
                {user.permissions?.canManagePayments && (
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Process
                    Payments
                  </li>
                )}
                {user.permissions?.canManageadmins && (
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span> Admin
                    Management
                  </li>
                )}
              </ul>
            </div>
          </Card>

          {/* Recent Activity */}
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
