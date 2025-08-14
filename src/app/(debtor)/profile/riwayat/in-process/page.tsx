"use client";

import { useState } from "react";
import { StatusTracker } from "./components/StatusTracker";
import { PengajuanKPRView } from "./components/PengajuanKPRView";
import { VerifikasiView } from "./components/VerifikasiView";

export default function InProcessDetailPage() {
  const currentProgress = 2;
  const [viewedStep, setViewedStep] = useState(currentProgress);

  const stepsData = [
    { title: "Pengajuan KPR", date: "01/08/2025" },
    { title: "Verifikasi Pengajuan", date: "05/08/2025" },
    { title: "Hasil Pengajuan", date: "" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Detail Pengajuan</h1>
        </header>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-700">
              Status Pengajuan
            </h2>
            <span className="bg-teal-100 text-teal-800 text-sm font-semibold px-4 py-1.5 rounded-full">
              Diproses
            </span>
          </div>

          <StatusTracker
            steps={stepsData}
            currentProgress={currentProgress}
            viewedStep={viewedStep}
            onStepClick={setViewedStep}
          />
        </div>

        <main className="mt-8">
          {viewedStep === 1 && <PengajuanKPRView />}
          {viewedStep === 2 && <VerifikasiView />}
        </main>
      </div>
    </div>
  );
}
