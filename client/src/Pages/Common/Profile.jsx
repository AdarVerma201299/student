import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  HouseDoor,
  Calendar,
  GenderAmbiguous,
  Person,
  CashCoin,
  Trash,
  Moon,
  Sun,
  X,
} from "react-bootstrap-icons";
import { fetchStudentData } from "../../redux/actions/studentActions";
import { deleteStudent } from "../../redux/actions/adminActions";
import { formatDate, getImageUrl, hasAdminRole } from "../../utils/helpers";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import ErrorMessage from "../../Components/Common/ErrorMessage";
import PaymentHistory from "../../Components/Common/Payment/PaymentHistory";
import {
  AadharModal,
  AddressSection,
  ContactSection,
  DetailCard,
  DetailRow,
  PageHeader,
  ProfileCard,
  ProfileDetailItem,
} from "../../Components/Common/ProfileComponents";
import ShiftFeeManagement from "../../Components/Admin/PaymentVerification/ShiftFeeManagement";

const Profile = () => {
  const [showFeeModal, setShowFeeModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    studentData,
    feeRecords,
    paymentHistory,
    pendingMonths,
    loading,
    error,
  } = useSelector((state) => state.student);

  const [showAadharModal, setShowAadharModal] = useState(false);
  const [activeAddress, setActiveAddress] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      if (savedMode !== null) return JSON.parse(savedMode);
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    setIsAdmin(hasAdminRole());
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (id && !studentData && isMounted) {
      dispatch(fetchStudentData(id));
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch, id, studentData]);

  const handleRemoveStudent = async () => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      try {
        await dispatch(deleteStudent(id));
        navigate(`/student-management/admin/${id}`);
      } catch (err) {
        console.error("Failed to remove student:", err);
      }
    }
  };

  const toggleAddress = (type) => {
    setActiveAddress(activeAddress === type ? null : type);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Dark mode toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-300"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Header */}
        <PageHeader
          title="Student Profile"
          subtitle={`${studentData?.name || "Student"}'s academic details`}
        />

        {/* Aadhar Card Modal */}
        <AadharModal
          isOpen={showAadharModal}
          onClose={() => setShowAadharModal(false)}
          frontImage={studentData?.aadhar?.frontImage}
          backImage={studentData?.aadhar?.backImage}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard
              image={getImageUrl(studentData?.profileImage)}
              name={studentData?.name}
              role="Student"
              isActive={studentData?.isActive}
              onViewAadhar={() => setShowAadharModal(true)}
            >
              <ProfileDetailItem
                icon={<Person className="dark:text-gray-300" />}
                label="Father"
                value={studentData?.fatherName}
              />
              <ProfileDetailItem
                icon={<GenderAmbiguous className="dark:text-gray-300" />}
                label="Gender"
                value={studentData?.gender}
              />
              <ProfileDetailItem
                icon={<Calendar className="dark:text-gray-300" />}
                label="DOB"
                value={formatDate(studentData?.dob)}
              />
              <ProfileDetailItem
                icon={<HouseDoor className="dark:text-gray-300" />}
                label="School"
                value={studentData?.school}
              />

              <AddressSection
                residentialAddress={studentData?.address?.residential}
                permanentAddress={studentData?.address?.permanent}
                activeAddress={activeAddress}
                onToggleAddress={toggleAddress}
              />

              <ContactSection
                email={studentData?.email}
                phone={studentData?.phone}
              />

              {isAdmin && (
                <button
                  onClick={handleRemoveStudent}
                  className="btn-danger mt-4 w-full flex items-center justify-center"
                >
                  <Trash className="mr-2" />
                  Remove Student
                </button>
              )}
            </ProfileCard>
          </div>

          {/* Right Column - Details */}

          <div className="lg:col-span-3 space-y-6">
            {/* Academic Details Card */}
            <DetailCard title="Academic Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="section-subtitle">Enrollment Information</h3>
                  <DetailRow
                    label="Joining Date"
                    value={formatDate(studentData?.createdAt)}
                  />
                  <DetailRow label="Pending Fee">
                    {pendingMonths > 0 && studentData.isActive ? (
                      <>
                        <span className="text-red-600 dark:text-red-400">
                          {pendingMonths} Month(s)
                        </span>
                        <Link
                          to="/payment"
                          className="btn-success mt-4 w-full flex items-center justify-center"
                        >
                          <CashCoin className="mr-2" />
                          Make a Payment
                        </Link>
                      </>
                    ) : (
                      <span className="text-green-600 dark:text-green-400">
                        No Fee Pending
                      </span>
                    )}
                  </DetailRow>
                </div>

                <div>
                  <h3 className="section-subtitle">Fee & Shift</h3>
                  {feeRecords.length > 0 && (
                    <>
                      <DetailRow
                        label="Monthly Fee"
                        value={`₹${feeRecords[0]?.fee || "Not Assigned"}`}
                      />
                      <DetailRow
                        label="Current Shift"
                        value={feeRecords[0]?.shift || "Not Assigned"}
                      />
                    </>
                  )}
                  {isAdmin && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
                      <button
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-200 to-blue-900 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-md shadow hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800"
                        onClick={() => setShowFeeModal(true)}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span>Update Fee Records</span>
                        </div>
                      </button>

                      {showFeeModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                              <h3 className="text-lg font-semibold dark:text-white">
                                Set Shift Fee
                              </h3>
                              <button
                                onClick={() => setShowFeeModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                              >
                                <X size={24} />
                              </button>
                            </div>
                            <ShiftFeeManagement
                              studentId={studentData?._id}
                              onSubmitSuccess={() => setShowFeeModal(false)}
                              Active={studentData?.isActive}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </DetailCard>

            {/* Payment History */}
            <PaymentHistory
              payments={paymentHistory}
              studentId={id}
              isAdmin={isAdmin}
            />
          </div>

          {/* <div className="lg:col-span-3 space-y-6">
            <DetailCard title="Academic Details">
              <DetailRow
                label="Joining Date"
                value={formatDate(studentData?.createdAt)}
              />
              {isAdmin && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <button
                    className="mt-2 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded flex items-center justify-center w-full"
                    onClick={() => setShowFeeModal(true)}
                  >
                    No fee records found. Please set up shift-fee records
                  </button>

                  {showFeeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                          <h3 className="text-lg font-semibold dark:text-white">
                            Set Shift Fee
                          </h3>
                          <button
                            onClick={() => setShowFeeModal(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                          >
                            <X size={24} />
                          </button>
                        </div>
                        <ShiftFeeManagement
                          studentId={studentData?._id}
                          onSubmitSuccess={() => setShowFeeModal(false)}
                          Active={studentData?.isActive}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DetailCard>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
