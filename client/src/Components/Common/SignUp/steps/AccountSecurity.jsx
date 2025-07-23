import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpAction } from "../../../../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";

import {
  MinusIcon,
  CheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
export const AccountSecurity = ({ formData, setFormData, prevStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (formData.password.length <= 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    const formDataToSend = new FormData();

    // Common fields for all user types
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("role", formData.userType); // Use dynamic role from formData
    formDataToSend.append("fatherName", formData.fatherName);
    formDataToSend.append("dob", formData.dob);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("school", formData.school);
    formDataToSend.append("aadhaar", formData.aadhaar);
    // Append documents (common for all user types)
    if (formData.documents.profileImage) {
      formDataToSend.append("profileImage", formData.documents.profileImage);
    }
    if (formData.documents.frontAadhaar) {
      formDataToSend.append("frontAadhaar", formData.documents.frontAadhaar);
    }
    if (formData.documents.backAadhaar) {
      formDataToSend.append("backAadhaar", formData.documents.backAadhaar);
    }
    formDataToSend.append(
      "residential",
      JSON.stringify(formData.address.residential)
    );
    formDataToSend.append(
      "permanent",
      JSON.stringify(formData.address.permanent)
    );
    formDataToSend.append("isPermanentSame", formData.address.isPermanentSame);
    // Handle user type specific fields
    if (formData.userType === "admin") {
      formDataToSend.append(
        "permissions",
        JSON.stringify(formData.permissions)
      );
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("department", formData.department);
    }
    console.log("formData", formData);

    try {
      await dispatch(
        signUpAction({
          formData: formDataToSend,
          navigate,
          userType: formData.userType,
        })
      );
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Account Security
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Create a strong password"
                required
              />
              {formData.password && (
                <div className="absolute right-3 top-3 text-gray-400">
                  {formData.password.length >= 8 ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              onBlur={validatePasswords}
              className={`w-full px-4 py-2.5 border text-gray-700 ${
                passwordError ? "border-red-400" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 ${
                passwordError ? "focus:ring-red-500" : "focus:ring-blue-500"
              } focus:border-transparent transition-all`}
              placeholder="Re-enter your password"
              required
            />
            {passwordError && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {passwordError}
              </p>
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Password Requirements
          </h3>
          <ul className="text-xs text-blue-700 space-y-1.5 p-3">
            <li className="flex items-center">
              {formData.password?.length >= 8 ? (
                <CheckIcon className="h-3 w-4 text-green-500 mr-2" />
              ) : (
                <MinusIcon className="h-3 w-4 text-gray-400 mr-2" />
              )}
              At least 8 characters long
            </li>
            <li className="flex items-center">
              {/\d/.test(formData.password) ? (
                <CheckIcon className="h-3 w-4 text-green-500 mr-2" />
              ) : (
                <MinusIcon className="h-3 w-4 text-gray-400 mr-2" />
              )}
              Contains at least one number
            </li>
            <li className="flex items-center">
              {/[!@#$%^&*]/.test(formData.password) ? (
                <CheckIcon className="h-3 w-4 text-green-500 mr-2" />
              ) : (
                <MinusIcon className="h-3 w-4 text-gray-400 mr-2" />
              )}
              Contains at least one special character
            </li>
          </ul>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
            <ExclamationCircleIcon className="h-4 w-3 mr-2 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
            <CheckCircleIcon className="h-3 w-6 mr-2 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
            Previous
          </button>
          <button
            type="submit"
            disabled={loading || passwordError}
            className={`px-5 py-2.5 text-white rounded-lg font-medium transition-colors ${
              loading || passwordError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } flex items-center`}
          >
            {loading ? (
              <>
                {/* <ClipLoader className="h-4 w-4 mr-1.5 animate-spin" /> */}
                Submitting...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-1.5" />
                Complete Registration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSecurity;
