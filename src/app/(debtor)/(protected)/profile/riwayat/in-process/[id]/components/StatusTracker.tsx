"use client";

import React from 'react';

type StepData = {
  title: string;
  date: string;
};

type StatusTrackerProps = {
  steps: StepData[];
  currentProgress: number;
  viewedStep: number;
  onStepClickAction: (step: number) => void;
  status?: "selesai" | "ditolak" | "dalam_proses";
};

export const StatusTracker = ({
  steps,
  currentProgress,
  viewedStep,
  onStepClickAction,
  status,
}: StatusTrackerProps) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center w-full max-w-4xl">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentProgress;
          const isActive = stepNumber === currentProgress;
          const canClick = isCompleted;

          return (
            <React.Fragment key={step.title}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => canClick && onStepClickAction(stepNumber)}
                  disabled={!canClick}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                    ${stepNumber === 3 && status === 'ditolak'
                      ? 'bg-red-500 text-white border-2 border-red-500'
                      : isCompleted && !isActive
                      ? 'bg-green-500 text-white border-2 border-green-500'
                      : isActive
                      ? 'bg-green-500 text-white border-2 border-green-500'
                      : 'bg-gray-200 text-gray-500 border-2 border-gray-200'
                    }
                    ${canClick ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'}
                  `}
                >
                  {stepNumber === 3 && status === 'ditolak' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : stepNumber === 3 && status === 'selesai' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : isCompleted && !isActive ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </button>
                <span className={`mt-2 text-xs font-medium text-center ${
                  isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center px-4">
                  <div className={`w-full h-0.5 ${
                    stepNumber < currentProgress ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
