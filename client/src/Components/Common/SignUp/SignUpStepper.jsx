export const SignUpStepper = ({ currentStep, totalSteps, stepLabels }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep > i + 1
                  ? "bg-green-500 text-white"
                  : currentStep === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-xs mt-1 text-gray-500">
              {stepLabels[i] || `Step ${i + 1}`}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
