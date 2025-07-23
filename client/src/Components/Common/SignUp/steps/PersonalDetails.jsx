import React from "react";

export const PersonalDetails = ({ formData, setFormData, nextStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const allFieldsFilled = () => {
    const requiredFields = [
      "name",
      "fatherName",
      "dob",
      "gender",
      "email",
      "phone",
      "school",
      "aadhaar",
    ];
    return requiredFields.every((field) => formData[field]);
  };

  return (
    <div className="space-y-4 text-black">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="text-black">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="text-black ">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Father's Name
          </label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter father's name"
            required
          />
        </div>

        <div className="text-black ">
          <label className="block text-sm font-medium text-black mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="text-black ">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="text-black ">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter phone number"
            maxLength="10"
            required
          />
        </div>

        <div className="text-black ">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter email address"
            required
          />
        </div>

        <div className=" text-black">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            School/College Name
          </label>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter school/college name"
            required
          />
        </div>
        <div className=" text-black">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Aadhaar
          </label>
          <input
            type="text"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter aadhaar number"
            required
          />
        </div>
      </div>

      <div className="flex justify-end mt-6 text-black">
        <button
          onClick={nextStep}
          disabled={!allFieldsFilled()}
          className={`px-4 py-2 rounded-md text-black ${
            allFieldsFilled()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};
