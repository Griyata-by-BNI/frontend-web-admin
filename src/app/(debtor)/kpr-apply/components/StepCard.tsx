interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

export const StepCard = ({ number, title, description }: StepCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left h-full">
      <div className="w-12 h-12 flex-shrink-0 bg-white border-4 border-teal-500 text-[#00716E] text-2xl font-bold flex items-center justify-center rounded-full mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm flex-grow">{description}</p>
      <div className="flex space-x-1.5 mt-4">
        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
      </div>
    </div>
  );
};
