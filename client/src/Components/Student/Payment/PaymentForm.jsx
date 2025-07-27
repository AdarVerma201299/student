import React, { useState } from "react";

const PaymentForm = ({ onSubmit, selectedFee, loading }) => {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    method: "upi",
    transactionId: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFee) {
      alert("Please select a fee record first");
      return;
    }
    onSubmit({
      amount: Number(paymentData.amount),
      method: paymentData.method,
      transactionId: paymentData.transactionId,
      shiftFee: selectedFee._id,
      notes: paymentData.notes,
    });
  };

  const maxAmount = selectedFee ? selectedFee.balance : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={paymentData.amount}
            onChange={handleChange}
            max={maxAmount}
            min="1"
            step="0.01"
            required
            className="w-full px-3 py-2 border rounded-md"
            disabled={!selectedFee || loading}
          />
          {selectedFee && (
            <p className="text-sm text-gray-500 mt-1">
              Maximum payable amount: ₹{maxAmount.toFixed(2)}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Payment Method</label>
          <select
            name="method"
            value={paymentData.method}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
          >
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>

        {paymentData.method !== "cash" && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              value={paymentData.transactionId}
              onChange={handleChange}
              required={paymentData.method !== "cash"}
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            name="notes"
            value={paymentData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            disabled={loading}
            rows="3"
          />
        </div>

        <button
          type="submit"
          disabled={!selectedFee || loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
            !selectedFee || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
