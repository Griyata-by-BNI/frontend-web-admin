"use client";

type StepData = {
  title: string;
  date: string;
};

type StatusTrackerProps = {
  steps: StepData[];
  currentProgress: number;
  viewedStep: number;
  onStepClick: (step: number) => void;
};

const Step = ({
  title,
  date,
  isCompleted,
  isViewed,
  onClick,
}: {
  title: string;
  date: string;
  isCompleted: boolean;
  isViewed: boolean;
  onClick: () => void;
}) => {
  const canClick = isCompleted;

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-500 mb-2 h-5">{date}</p>
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          isViewed
            ? "border-teal-500 bg-teal-500"
            : isCompleted
            ? "border-teal-500 bg-white"
            : "border-gray-300 bg-white"
        }`}
      />
      <button
        onClick={onClick}
        disabled={!canClick}
        className={`mt-3 text-center text-sm font-semibold ${
          canClick
            ? "text-teal-600 cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        {title}
      </button>
    </div>
  );
};

export const StatusTracker = ({
  steps,
  currentProgress,
  viewedStep,
  onStepClick,
}: StatusTrackerProps) => {
  return (
    <div className="w-full flex items-start">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber <= currentProgress;
        const isViewed = stepNumber === viewedStep;

        const isLineCompleted = stepNumber < currentProgress;

        return (
          <>
            <Step
              key={step.title}
              title={step.title}
              date={step.date}
              isCompleted={isCompleted}
              isViewed={isViewed}
              onClick={() => onStepClick(stepNumber)}
            />
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 mt-[34px] transition-colors duration-300 ${
                  isLineCompleted ? "bg-teal-500" : "bg-gray-300"
                }`}
              />
            )}
          </>
        );
      })}
    </div>
  );
};
