import React from "react";

const PaymentSummary = ({ shiftFees, onSelectFee, selectedFee }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Fee Summary</h2>

      {shiftFees?.length > 0 ? (
        <div className="space-y-4">
          {shiftFees.map((fee) => (
            <div
              key={fee._id}
              onClick={() => onSelectFee(fee)}
              className={`p-4 border rounded-md cursor-pointer transition-colors ${
                selectedFee?._id === fee._id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">{fee.shift} Shift</span>
                <span className="text-sm text-gray-600">
                  {fee.academicYear}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Total Fee:</span>
                <span>₹{fee.fee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid:</span>
                <span>₹{(fee.fee - fee.balance).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Balance:</span>
                <span
                  className={
                    fee.balance > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  ₹{fee.balance.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 text-center">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    fee.status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : fee.status === "PARTIAL"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {fee.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No fee records found</p>
      )}
    </div>
  );
};

export default PaymentSummary;
