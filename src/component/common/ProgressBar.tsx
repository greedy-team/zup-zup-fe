const ProgressBar: React.FC<{ steps: string[]; currentStep: number }> = ({
  steps,
  currentStep,
}) => {
  const totalSteps = steps.length;

  const safeCurrent = Math.max(1, Math.min(currentStep, Math.max(1, totalSteps)));

  const progressRatio = totalSteps > 1 ? (safeCurrent - 1) / (totalSteps - 1) : 0;

  return (
    <div className="relative my-7">
      <div className="absolute top-5 left-0 h-0.5 w-full bg-gray-200" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-teal-500 transition-all duration-500"
        style={{ width: `${progressRatio * 100}%` }}
      />
      <div className="relative z-10 flex justify-between">
        {steps.map((stepName, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === safeCurrent;
          const isCompleted = stepNumber < safeCurrent;
          return (
            <div key={stepName} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-base font-bold transition-all duration-300 ${
                  isActive || isCompleted
                    ? 'border-teal-500 bg-teal-500 text-white'
                    : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
              <p
                className={`mt-2 text-sm font-semibold transition-colors duration-300 ${
                  isActive || isCompleted ? 'text-teal-500' : 'text-gray-500'
                }`}
              >
                {stepName}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
