import React from 'react';

interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'completed' | 'active' | 'pending';
}

interface StatusTrackerProps {
  steps: Step[];
}

export default function StatusTracker({ steps }: StatusTrackerProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-white font-medium
                ${step.status === 'completed' 
                  ? 'bg-green-500' 
                  : step.status === 'active' 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300'
                }
              `}
            >
              {step.icon}
            </div>
            <span
              className={`
                mt-2 text-sm font-medium text-center
                ${step.status === 'completed' 
                  ? 'text-green-600' 
                  : step.status === 'active' 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
                }
              `}
            >
              {step.title}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4">
              <div
                className={`
                  h-0.5 w-full
                  ${steps[index + 1].status === 'completed' || step.status === 'completed'
                    ? 'bg-green-300'
                    : 'bg-gray-200'
                  }
                `}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Example usage with common icons
export const StatusTrackerExample = () => {
  const steps: Step[] = [
    {
      id: 'login',
      title: 'Login Details',
      status: 'completed',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'profile',
      title: 'User Profile',
      status: 'active',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 'finish',
      title: 'Finish',
      status: 'pending',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return <StatusTracker steps={steps} />;
};