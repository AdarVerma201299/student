import React from "react";
import { Moon, Sun } from "react-bootstrap-icons";
export const ProfileLoadingPage = ({ darkMode, toggleDarkMode }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Dark mode toggle */}
        <div className="flex justify-end mb-8">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-300"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Animated loading content */}
        <div className="space-y-8">
          {/* Pulse animation for profile image placeholder */}
          <div className="flex justify-center">
            <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>

          {/* Text placeholders with different animation delays */}
          <div className="space-y-4">
            <div className="h-8 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            <div className="h-4 w-48 mx-auto bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>

          {/* Grid skeleton loader */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
              >
                <div className="h-5 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="pt-8">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:text-blue-200 dark:bg-blue-700">
                    Loading
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-300">
                    75%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-700">
                <div
                  style={{ width: "75%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 dark:bg-blue-400 animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardLoadingSkeleton = () => (
  <div className="ml-44 p-6 space-y-6 animate-pulse">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center">
      <div className="h-10 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-lg shadow">
          <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>

    {/* Main Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="h-6 w-1/4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="space-y-6">
        <div className="h-48 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const DataSheetSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/5 bg-gray-200 rounded mt-2"></div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Student", "Status", "Join Date", "Last Active", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index}>
                {/* Student Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                </td>

                {/* Join Date Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </td>

                {/* Last Active Column */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-4">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
