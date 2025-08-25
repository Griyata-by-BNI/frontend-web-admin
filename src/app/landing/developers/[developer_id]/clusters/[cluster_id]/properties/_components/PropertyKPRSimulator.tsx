"use client";

import { KPRSimulator } from "@/app/(debtor)/kpr-simulator";

interface PropertyKPRSimulatorProps {
  propertyPrice: number;
}

export default function PropertyKPRSimulator({
  propertyPrice,
}: PropertyKPRSimulatorProps) {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Simulasi KPR
      </h2>
      <KPRSimulator initialPropertyPrice={propertyPrice} size="small" />
    </div>
  );
}