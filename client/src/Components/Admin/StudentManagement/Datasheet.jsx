import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Person,
  CheckCircle,
  XCircle,
  Calendar,
  PencilSquare,
  Trash,
} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { fetchStudentSuccess } from "../../../redux/slices/studentSlice";

const DataSheet = ({ students = [], onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const studentCount = students?.length || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Student Records
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {students.length} student{studentCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.isArray(students) &&
              students.map((student) => (
                <tr
                  key={student._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    dispatch(
                      fetchStudentSuccess({
                        studentData: student,
                        feeRecords: student.feeRecords || [],
                        paymentHistory: student.payments || [],
                      })
                    );
                    navigate(`/profile/${student._id}`, { state: { student } });
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Person
                          className="text-blue-600 dark:text-blue-300"
                          size={18}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.isActive ? (
                        <>
                          <CheckCircle className="text-green-500 mr-2" />
                          <span className="text-sm text-gray-900 dark:text-gray-200">
                            Active
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-500 mr-2" />
                          <span className="text-sm text-gray-900 dark:text-gray-200">
                            Inactive
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2" size={14} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {student.lastLogin
                        ? new Date(student.lastLogin).toLocaleString()
                        : "Never logged in"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(student);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4"
                    >
                      <PencilSquare size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(student._id);
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {studentCount === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <Person size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
            No students found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            There are currently no student records available.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataSheet;
