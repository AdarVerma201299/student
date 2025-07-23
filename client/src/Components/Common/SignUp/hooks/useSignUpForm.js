// src/auth/Components/Common/SignUp/hooks/useSignUpForm.js
import { useState } from "react";

export const useSignUpForm = (userType) => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    school: "",
    aadhaar: "",
    userType: userType,
    address: {
      residential: {
        village: "",
        post: "",
        district: "",
        state: "",
        country: "India",
        pincode: "",
      },
      permanent: {
        village: "",
        post: "",
        district: "",
        state: "",
        country: "India",
        pincode: "",
      },
      isPermanentSame: true,
    },
    documents: {
      frontAadhaar: null,
      backAadhaar: null,
      profileImage: null,
    },
    permissions: {
      canManageStudents: false,
      canManagePayments: false,
      canManageAdmins: false,
      allowedDepartments: [],
    },
    password: "",
    confirmPassword: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  return {
    formData,
    setFormData,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
  };
};
