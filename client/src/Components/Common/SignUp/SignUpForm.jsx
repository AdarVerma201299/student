import { PersonalDetails } from "./steps/PersonalDetails";
import { AddressDetails } from "./steps/AddressDetails";
import { DocumentUpload } from "./steps/DocumentUpload";
import { AccountSecurity } from "./steps/AccountSecurity";
import { SignUpStepper } from "./SignUpStepper";
import Permissions from "./steps/Permissions";
export const SignUpForm = ({
  formData,
  userType,
  setFormData,
  currentStep,
  nextStep,
  prevStep,
  totalSteps,
}) => {
  // Define fields required for each user type
  const userTypeConfig = {
    student: {
      steps: [PersonalDetails, AddressDetails, DocumentUpload, AccountSecurity],
      stepLabels: ["Personal", "Address", "Documents", "Security"],
    },
    admin: {
      steps: [
        PersonalDetails,
        AddressDetails,
        Permissions,
        DocumentUpload,
        AccountSecurity,
      ],
      stepLabels: [
        "Personal",
        "Address",
        "Permissions",
        "Document",
        "Security",
      ],
      totalSteps: 5,
    },
  };

  const config = userTypeConfig[userType] || userTypeConfig.student;
  const CurrentStepComponent = config.steps[currentStep - 1];
  if (!userType) {
    return <div>Error: User type not specified</div>;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {userType.toUpperCase()} Registration
      </h1>
      <SignUpStepper
        currentStep={currentStep}
        totalSteps={config.totalSteps || totalSteps}
        stepLabels={config.stepLabels}
      />

      <div className="space-y-6">
        <CurrentStepComponent
          formData={formData}
          setFormData={setFormData}
          userType={userType}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </div>
    </div>
  );
};
