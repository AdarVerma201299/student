// src/auth/Pages/Common/SignUp.jsx
import React from "react";
import { useSignUpForm } from "../../Components/Common/SignUp/hooks/useSignUpForm";
import { SignUpForm } from "../../Components/Common/SignUp/SignUpForm";
import { useParams, Link } from "react-router-dom";
function SignUp() {
  const { userType } = useParams();
  // console.log("user:", userType);
  const { formData, setFormData, currentStep, totalSteps, nextStep, prevStep } =
    useSignUpForm(userType);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <SignUpForm
          formData={formData}
          userType={userType}
          setFormData={setFormData}
          currentStep={currentStep}
          totalSteps={totalSteps}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </div>
      <p>
        If Don't have account/
        <Link to={`/signup/${userType}`}>Sign Up</Link>
      </p>
    </div>
  );
}

export default SignUp;
