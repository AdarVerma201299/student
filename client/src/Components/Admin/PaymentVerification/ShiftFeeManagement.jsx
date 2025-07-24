import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createShiftFee,
  updateShiftFee,
} from "../../../redux/actions/adminActions";
import { hasAdminRole } from "../../../utils/helpers";
import {
  PencilSquare,
  PlusCircle,
  // CashCoin,
  // Calendar,
  CheckCircle,
  ExclamationCircle,
  XCircle,
} from "react-bootstrap-icons";
// import {
// ArrowUpCircleIcon,
// ArrowDownCircleIcon,
// } from "@heroicons/react/24/outline";

const ShiftFeeManagement = ({ studentId, Active, onSubmitSuccess }) => {
  const dispatch = useDispatch();
  const { feeRecords } = useSelector((state) => state.student);
  const [formData, setFormData] = useState({
    shift: "MORNING",
    fee: "",
    isActive: true,
  });
  console.log("asd", feeRecords, studentId);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState({ Active });
  const [currentFee, setCurrentFee] = useState(null);
  const [yearFilter, setYearFilter] = useState(
    new Date().getFullYear() + "-" + (new Date().getFullYear() + 1)
  );
  const isAdmin = hasAdminRole();

  const handleCreate = () => {
    setFormData({
      shift: "MORNING",
      fee: "",
      isActive: Active,
    });
    setEditMode(false);
    setCurrentFee(null);
    setShowModal(true);
  };

  const handleEdit = (fee) => {
    setFormData({
      shift: fee.shift,
      fee: fee.fee,
      isActive: fee.isActive,
    });
    setEditMode(true);
    // setCurrentFee(fee);
    // setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        academicYear: yearFilter,
      };

      console.log("payload", payload);
      if (editMode) {
        await dispatch(updateShiftFee(currentFee._id, payload));
      } else {
        await dispatch(
          createShiftFee({
            payload,
            studentId,
          })
        ).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error:", err);
    }
    onSubmitSuccess();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fee" ? parseFloat(value) || 0 : value,
    }));
  };

  const getShiftColor = (shift) => {
    switch (shift) {
      case "MORNING":
        return "bg-blue-100 text-blue-800";
      case "AFTERNOON":
        return "bg-orange-100 text-orange-800";
      case "EVENING":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="text-green-500 mr-1" />;
      case "PARTIAL":
        return <ExclamationCircle className="text-yellow-500 mr-1" />;
      default:
        return <XCircle className="text-red-500 mr-1" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
          Fee Management
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
          {isAdmin && (
            <button
              onClick={handleCreate}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <PlusCircle className="mr-2" />
              Add Fee
            </button>
          )}
        </div>
      </div>

      {/* {isAdmin && feeRecords?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {feeRecords.map((item) => (
            <div
              key={item._id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg dark:text-white">
                  {item._id} Shift
                </h3>
                <CashCoin
                  className="text-blue-500 dark:text-blue-400"
                  size={20}
                />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold dark:text-white">
                    ₹{item.totalFees}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.totalStudents} students
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-green-500 dark:text-green-400">
                    <ArrowUpCircleIcon className="h-5 w-5 mr-1" />
                    <span>₹{item.paidFees || 0}</span>
                  </div>
                  <div className="flex items-center text-red-500 dark:text-red-400">
                    <ArrowDownCircleIcon className="h-5 w-5 mr-1" />
                    <span>₹{item.totalFees - item.paidFees || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )} */}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Academic Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Shift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {feeRecords?.map((fee) => (
              <tr
                key={fee._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {fee.academicYear}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getShiftColor(
                      fee.shift
                    )}`}
                  >
                    {fee.shift}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ₹{fee.fee.toFixed(2)}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    fee.balance > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  ₹{fee.balance.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(fee.status)}
                    <span className="text-sm">{fee.status}</span>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(fee)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <PencilSquare />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editMode ? "Edit" : "Create"} Shift Fee
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Shift
                  </label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MORNING">Morning</option>
                    <option value="AFTERNOON">Afternoon</option>
                    <option value="EVENING">Evening</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fee Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {!editMode && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="isActive"
                      value={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.value === "true",
                        })
                      }
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg block w-full p-2.5 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>
                )}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    {editMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          onClick={handleSubmit}
        >
          {editMode ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default ShiftFeeManagement;
