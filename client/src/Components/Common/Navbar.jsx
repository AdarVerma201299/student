import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  List,
  House,
  PersonPlus,
  BoxArrowInRight,
  X,
  FileEarmarkBarGraph,
  CashStack,
  PeopleFill,
  GearFill,
  ClipboardData,
  CalendarCheck,
  PersonBadge,
} from "react-bootstrap-icons";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useSelector((state) => state.auth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNavbar = () => setExpanded(!expanded);

  const getUserDashboard = () => {
    if (!user) return "/";
    return user?.role === "student" ? `/profile/${user.id}` : "/dashboard";
  };
  const getUserPayment = () => {
    if (!user) return "/";
    return user?.role === "student"
      ? "/payment"
      : `/student-management/${user.role}/${user.id}/payment`;
  };

  // Close navbar when clicking outside (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event) => {
      const navbar = document.querySelector(".navbar-container");
      if (navbar && !navbar.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  return (
    <>
      {/* Mobile menu button (only shows on mobile) */}
      {isMobile && (
        <button
          onClick={toggleNavbar}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-200 rounded-md shadow-md"
        >
          {expanded ? <X size={24} /> : <List size={24} />}
        </button>
      )}

      {/* Navbar */}
      <nav
        className={`navbar-container fixed left-0 top-0 h-screen bg-gray-200 text-gray-800 transition-all duration-300 z-40 ${
          expanded ? "w-64" : "w-16"
        } ${isMobile && !expanded ? "-translate-x-full" : ""}`}
        onMouseEnter={!isMobile ? () => setExpanded(true) : undefined}
        onMouseLeave={!isMobile ? () => setExpanded(false) : undefined}
      >
        <div className="flex flex-col h-full pt-5">
          {/* Header */}
          <div className="flex items-center mb-8 p-2">
            {!isMobile && (
              <button
                onClick={toggleNavbar}
                className="text-gray-800 hover:bg-gray-300 p-2 rounded-full transition-colors"
              >
                <List size={24} />
              </button>
            )}
            {expanded && (
              <span className="ml-3 font-bold text-xl">Student Portal</span>
            )}
          </div>

          {/* Main Navigation */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            <Link
              to="/"
              className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => isMobile && setExpanded(false)}
            >
              <House size={20} />
              {expanded && <span className="ml-3">Home</span>}
            </Link>

            {user && (
              <>
                <Link
                  className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                  to={getUserDashboard()}
                  onClick={() => isMobile && setExpanded(false)}
                >
                  {user?.role === "student" ? (
                    <PersonBadge size={20} />
                  ) : (
                    <ClipboardData size={20} />
                  )}
                  {expanded && (
                    <span className="ml-3">
                      {user?.role === "student" ? "Profile" : "Dashboard"}
                    </span>
                  )}
                </Link>
                <Link
                  to={getUserPayment()}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => isMobile && setExpanded(false)}
                >
                  <CashStack size={20} />
                  {expanded && <span className="ml-3">Payment</span>}
                </Link>

                {user?.role === "admin" && (
                  <>
                    <Link
                      to={{
                        pathname: `/student-management/${user.role}/${user.id}/shift-management`,
                        state: { view: "shift" }, // Add view state to indicate shift management
                      }}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => isMobile && setExpanded(false)}
                    >
                      <CalendarCheck size={20} />
                      {expanded && (
                        <span className="ml-3">Shift Allotment</span>
                      )}
                    </Link>
                    <Link
                      to="/reports"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => isMobile && setExpanded(false)}
                    >
                      <FileEarmarkBarGraph size={20} />
                      {expanded && <span className="ml-3">Reports</span>}
                    </Link>

                    <Link
                      to="/user-management"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => isMobile && setExpanded(false)}
                    >
                      <PeopleFill size={20} />
                      {expanded && (
                        <span className="ml-3">User Management</span>
                      )}
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => isMobile && setExpanded(false)}
                    >
                      <GearFill size={20} />
                      {expanded && <span className="ml-3">Settings</span>}
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* User Section */}
          <div className="mt-auto border-t border-gray-300 pt-4 pb-4">
            {user ? (
              <div className="items-center p-2 rounded-lg hover:bg-gray-300 transition-colors">
                <ProfileDropdown
                  expanded={expanded}
                  isMobile={isMobile}
                  setExpanded={setExpanded}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/signin/student"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => isMobile && setExpanded(false)}
                >
                  <BoxArrowInRight size={20} />
                  {expanded && <span className="ml-3">Login</span>}
                </Link>
                <Link
                  to="/signup/student"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => isMobile && setExpanded(false)}
                >
                  <PersonPlus size={20} />
                  {expanded && <span className="ml-3">Sign Up</span>}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      {isMobile && expanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setExpanded(false)}
        />
      )}
    </>
  );
};

export default Navbar;
