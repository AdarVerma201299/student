import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Person,
  CheckCircle,
  XCircle,
  Calendar,
  PencilSquare,
  Trash,
  Search,
} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { fetchStudentSuccess } from "../../../redux/slices/studentSlice";

const DataSheet = ({ students = [], onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter students based on search term (name or email)
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;

    const term = searchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  const studentCount = filteredStudents?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header with Search */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Student Records
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Showing {studentCount} student{studentCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                Join Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                Last Active
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredStudents.map((student) => (
              <tr
                key={student._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  dispatch(
                    fetchStudentSuccess({
                      studentData: student,
                      feeRecords: student.feeRecords || [],
                      paymentHistory: student.paymentHistory || [],
                    })
                  );
                  navigate(`/profile/${student._id}`, { state: { student } });
                }}
              >
                {/* Student Info (always visible) */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Person
                        className="text-blue-600 dark:text-blue-300"
                        size={16}
                      />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate max-w-[120px] sm:max-w-[180px] md:max-w-none">
                        {student.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px] sm:max-w-[180px] md:max-w-none">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status (hidden on mobile) */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="flex items-center">
                    {student.isActive ? (
                      <>
                        <CheckCircle
                          className="text-green-500 mr-2"
                          size={14}
                        />
                        <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-red-500 mr-2" size={14} />
                        <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                          Inactive
                        </span>
                      </>
                    )}
                  </div>
                </td>

                {/* Join Date (hidden on mobile and tablet) */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="flex items-center">
                    <Calendar className="text-gray-400 mr-2" size={12} />
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                {/* Last Active (hidden on mobile, tablet, and small laptops) */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {student.lastLogin
                      ? new Date(student.lastLogin).toLocaleString()
                      : "Never logged in"}
                  </div>
                </td>

                {/* Actions (always visible) */}
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2 sm:space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(student);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      aria-label="Edit student"
                    >
                      <PencilSquare size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(student._id);
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      aria-label="Delete student"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {studentCount === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <Person size={40} className="mx-auto" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-200">
            {searchTerm ? "No matching students found" : "No students found"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {searchTerm
              ? "Try adjusting your search query"
              : "There are currently no student records available."}
          </p>
        </div>
      )}
    </div>
  );
};

export default DataSheet;
