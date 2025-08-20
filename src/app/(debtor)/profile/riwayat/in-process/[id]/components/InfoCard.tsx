import { ReactNode } from "react";

type Detail = {
  label: string;
  value: string | number;
};

type InfoCardProps = {
  title: string;
  details: Detail[];
  icon: ReactNode;
};

export const InfoCard = ({ title, details, icon }: InfoCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        {icon}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {details.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
