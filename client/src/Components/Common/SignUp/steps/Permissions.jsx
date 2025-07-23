import React, { useState } from "react";

const Permissions = ({ formData, setFormData, nextStep, prevStep }) => {
  const [newDepartment, setNewDepartment] = useState("");

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked,
      },
    }));
  };

  const handleAddDepartment = () => {
    if (
      newDepartment.trim() &&
      !formData.permissions.allowedDepartments.includes(newDepartment)
    ) {
      setFormData((prev) => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          allowedDepartments: [
            ...prev.permissions.allowedDepartments,
            newDepartment.trim(),
          ],
        },
      }));
      setNewDepartment("");
    }
  };

  const handleRemoveDepartment = (department) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        allowedDepartments: prev.permissions.allowedDepartments.filter(
          (d) => d !== department
        ),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Admin Permissions
      </h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="canManageStudents"
            name="canManageStudents"
            checked={formData.permissions.canManageStudents}
            onChange={handlePermissionChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="canManageStudents"
            className="ml-2 block text-sm text-gray-700"
          >
            Can Manage Students
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="canManagePayments"
            name="canManagePayments"
            checked={formData.permissions.canManagePayments}
            onChange={handlePermissionChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="canManagePayments"
            className="ml-2 block text-sm text-gray-700"
          >
            Can Manage Payments
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="canManageAdmins"
            name="canManageAdmins"
            checked={formData.permissions.canManageAdmins}
            onChange={handlePermissionChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="canManageAdmins"
            className="ml-2 block text-sm text-gray-700"
          >
            Can Manage Other Admins
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allowed Departments
          </label>
          <div className="flex">
            <input
              type="text"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Department name"
            />
            <button
              type="button"
              onClick={handleAddDepartment}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>

          <div className="mt-2 space-y-1">
            {formData.permissions.allowedDepartments.map((department) => (
              <div
                key={department}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span>{department}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDepartment(department)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Permissions;
