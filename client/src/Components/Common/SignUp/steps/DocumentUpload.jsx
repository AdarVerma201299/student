import React, { useState } from "react";

export const DocumentUpload = ({
  formData,
  setFormData,
  nextStep,
  prevStep,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [frontAadhaarPreview, setFrontAadhaarPreview] = useState(null);
  const [backAadhaarPreview, setBackAadhaarPreview] = useState(null);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: file,
        },
      }));

      // Update the correct preview state based on input name
      switch (name) {
        case "profileImage":
          setImagePreview(previewUrl);
          break;
        case "frontAadhaar":
          setFrontAadhaarPreview(previewUrl);
          break;
        case "backAadhaar":
          setBackAadhaarPreview(previewUrl);
          break;
        default:
          console.warn(`Unexpected document type: ${name}`);
          break;
      }
    }
  };

  const allFieldsFilled = () => {
    const requiredFields = ["profileImage", "frontAadhaar", "backAadhaar"];
    return requiredFields.every((field) => formData.documents[field]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Document Upload
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Upload Photo
          </label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="h-40 w-40 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Aadhaar Card Front
          </label>
          <input
            type="file"
            name="frontAadhaar"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {frontAadhaarPreview && (
            <div className="mt-2">
              <img
                src={frontAadhaarPreview}
                alt="Aadhaar Front Preview"
                className="h-40 w-full object-contain rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Aadhaar Card Back
          </label>
          <input
            type="file"
            name="backAadhaar"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {backAadhaarPreview && (
            <div className="mt-2">
              <img
                src={backAadhaarPreview}
                alt="Aadhaar Back Preview"
                className="h-40 w-full object-contain rounded-md border"
              />
            </div>
          )}
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
          disabled={!allFieldsFilled()}
          className={`px-4 py-2 rounded-md text-white ${
            allFieldsFilled()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
