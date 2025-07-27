import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  ClockHistory,
  // CheckCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill,
} from "react-bootstrap-icons";
import PaymentForm from "../../../Components/Student/Payment/PaymentForm";
import PaymentHistory from "../../../Components/Common/Payment/PaymentHistory";
import PaymentSummary from "../../../Components/Common/Payment/PaymentSummary";
import { createPayment } from "../../../redux/actions/paymentActions";
import LoadingSpinner from "../../../Components/Common/LoadingSpinner";

const Payment = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const {
    studentData,
    feeRecords,
    paymentHistory,
    // pendingMonths,
    loading,
    error,
  } = useSelector((state) => state.student);

  const [activeTab, setActiveTab] = useState("make-payment");
  const [selectedFee, setSelectedFee] = useState(null);

  const handlePaymentSubmit = async (paymentData) => {
    try {
      dispatch(
        createPayment({
          paymentData, // The actual payment data
          studentId: studentData._id,
          academicYear: selectedFee?.academicYear,
        })
      );
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  if (loading) return <LoadingSpinner fullPage={true} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <CreditCard className="text-blue-600 mr-3" size={28} />
          <h1 className="text-3xl font-bold text-gray-800">
            Fee Payment Portal
          </h1>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <ExclamationTriangleFill className="mr-3" size={20} />
            <div>
              <p className="font-semibold">Payment Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* {successMessage && (
          <div className="flex items-center bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <CheckCircleFill className="mr-3" size={20} />
            <div>
              <p className="font-semibold">Success!</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )} */}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`flex items-center py-3 px-6 font-medium text-sm ${
              activeTab === "make-payment"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("make-payment")}
          >
            <CreditCard className="mr-2" size={16} />
            Make Payment
          </button>
          <button
            className={`flex items-center py-3 px-6 font-medium text-sm ${
              activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            <ClockHistory className="mr-2" size={16} />
            Payment History
          </button>
        </div>

        {activeTab === "make-payment" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <InfoCircleFill className="text-blue-500 mr-2" size={18} />
                  Payment Information
                </h2>
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  selectedFee={selectedFee}
                  loading={loading}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-4">
                <PaymentSummary
                  shiftFees={feeRecords}
                  onSelectFee={setSelectedFee}
                  selectedFee={selectedFee}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <PaymentHistory payments={paymentHistory} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
