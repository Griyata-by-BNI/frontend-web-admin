import React from "react";

interface FilterSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export function FilterSection({ icon, title, children }: FilterSectionProps) {
  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>

      {children}
    </div>
  );
}
