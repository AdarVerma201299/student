import React from "react";

export const AddressDetails = ({
  formData,
  setFormData,
  nextStep,
  prevStep,
}) => {
  const handleSameAddressToggle = () => {
    setFormData((prev) => {
      return {
        ...prev,
        address: {
          ...prev.address,
          isPermanentSame: !prev.address.isPermanentSame,
          // Only update residential address when toggling to "same"
          residential: !prev.address.isPermanentSame
            ? { ...prev.address.permanent }
            : { ...prev.address.residential },
        },
      };
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    const [addressType, field] = name.split("."); // permanent.village → ['permanent', 'village']

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [addressType]: {
          ...prev.address[addressType],
          [field]: value,
        },

        ...(prev.address.isPermanentSame && addressType === "permanent"
          ? {
              residential: {
                ...prev.address.permanent,
                [field]: value,
              },
            }
          : {}),
      },
    }));
  };

  const allFieldsFilled = () => {
    const requiredFields = [
      "permanent.village",
      "permanent.post",
      "permanent.district",
      "permanent.state",
      "permanent.pincode",
      "residential.village",
      "residential.post",
      "residential.district",
      "residential.state",
      "residential.pincode",
    ];

    return requiredFields.every((field) => {
      const [addressType, key] = field.split(".");
      return formData.address[addressType][key]?.trim() !== "";
    });
  };
  const renderAddressFields = (prefix, title) => (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600">Village</label>
          <input
            type="text"
            name={`${prefix}.village`}
            value={formData.address[prefix].village}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={
              prefix === "residential" && formData.address.isPermanentSame
            }
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Post</label>
          <input
            type="text"
            name={`${prefix}.post`}
            value={formData.address[prefix].post}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">District</label>
          <input
            type="text"
            name={`${prefix}.district`}
            value={formData.address[prefix].district}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">State</label>
          <input
            type="text"
            name={`${prefix}.state`}
            value={formData.address[prefix].state}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Country</label>
          <input
            type="text"
            name={`${prefix}.country`}
            value={formData.address[prefix].country}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Pincode</label>
          <input
            type="text"
            name={`${prefix}.pincode`}
            value={formData.address[prefix].pincode}
            onChange={handleLocationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 text-black">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Address Information
      </h2>

      {renderAddressFields("permanent", "Permanent Address")}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="sameAddress"
          checked={formData.address.isPermanentSame} // Use formData state
          onChange={handleSameAddressToggle}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="sameAddress"
          className="ml-2 block text-sm text-gray-700"
        >
          Same as Permanent Address
        </label>
      </div>

      {!formData.address.isPermanentSame &&
        renderAddressFields("residential", "Residential Address")}

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

export default AddressDetails;
